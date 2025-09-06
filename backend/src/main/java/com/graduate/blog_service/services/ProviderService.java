package com.graduate.blog_service.services;

import com.graduate.blog_service.Dto.providerDto.ProviderDto;
import com.graduate.blog_service.Dto.providerDto.ProviderListDto;
import com.graduate.blog_service.Dto.providerDto.UpdateProviderDto;
import com.graduate.blog_service.exceptions.EmailAlreadyExistsException;
import com.graduate.blog_service.exceptions.ResourceNotFoundException;
import com.graduate.blog_service.mapper.ProviderListToDto;
import com.graduate.blog_service.mapper.ProviderMapper;
import com.graduate.blog_service.models.Provider;
import com.graduate.blog_service.models.Role;
import com.graduate.blog_service.repositorys.ProviderRepository;
import com.graduate.blog_service.repositorys.RoleRepository;
import com.graduate.blog_service.utils.ImageUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProviderService {

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public ProviderService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ImageUtils imageUtils;


    @Autowired
    private ProviderMapper providerMapper;

    @Autowired
    private ProviderListToDto providerListToDto;


    public ProviderDto createProvider(ProviderDto providerDto, MultipartFile[] images){
        if (providerRepository.findByEmail(providerDto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("This email already exists");
        }
        Provider provider = providerMapper.toEntity(providerDto);
        Set<Role> roles = new HashSet<>();
        Role role = roleRepository.findByName("PROVIDER");
        roles.add(role);
        provider.setRoles(roles);
        provider.setPassword(passwordEncoder.encode(providerDto.getPassword()));

        List<String> imagePaths = new ArrayList<>();

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                String imagePath = imageUtils.saveImage(image,"/provider-images/"); // Implement this to save the image
                imagePaths.add(imagePath); // Add the image path to the list
            }
        }

        provider.setImages(imagePaths);
        providerRepository.save(provider);
        return providerMapper.toDto(provider);

    }

    public UpdateProviderDto updateProvider(UpdateProviderDto updateProviderDto, Long id)  {
        Provider provider  = providerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Provider" , " id " , id));
        if (!provider.getEmail().equals(updateProviderDto.getEmail())) {
            throw new EmailAlreadyExistsException("This email already exists");
        }
        provider.setName(updateProviderDto.getName());
        provider.setEmail(updateProviderDto.getEmail());
        provider.setPhone(updateProviderDto.getPhone());
        provider.setServiceSpecialty(updateProviderDto.getServiceSpecialty());
        provider.setInfo(updateProviderDto.getInfo());
        if (updateProviderDto.getPassword() != null && !updateProviderDto.getPassword().isEmpty()) {
            if (updateProviderDto.getPassword().length() < 8 || updateProviderDto.getPassword().length() > 25) {
                throw new IllegalArgumentException("The password should be between 8 and 25 characters");
            }
            provider.setPassword(passwordEncoder.encode(updateProviderDto.getPassword()));
        }

        // Handle new images
        List<String> imagePaths = new ArrayList<>(provider.getImages()); // Start with existing images

        if (updateProviderDto.getNewImages() != null) {
            for (MultipartFile image : updateProviderDto.getNewImages()) {
                if (!image.isEmpty()) {
                    String imagePath = imageUtils.saveImage(image,"/provider-images/"); // Implement this method
                    imagePaths.add(imagePath);
                }
            }
        }

        // Handle deletion of images
        if (updateProviderDto.getImagesToDelete() != null) {
            for (String imagePath : updateProviderDto.getImagesToDelete()) {
                imageUtils.deleteImage(imagePath); // Implement this method to delete the image from the filesystem
                imagePaths.remove(imagePath); // Remove from the list of paths
            }
        }

        provider.setImages(imagePaths); // Set updated images

        provider.setIsActive(updateProviderDto.getIsActive());

        providerRepository.save(provider);
        return providerMapper.toUpdateDto(provider);
    }

    public UpdateProviderDto getProviderById(Long id) {
        Provider provider = providerRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Provider" , " id " , id));
        UpdateProviderDto updateProviderDto = new UpdateProviderDto();

        updateProviderDto.setId(provider.getId());
        updateProviderDto.setName(provider.getName());
        updateProviderDto.setEmail(provider.getEmail());
        updateProviderDto.setPhone(provider.getPhone());
        updateProviderDto.setServiceSpecialty(provider.getServiceSpecialty());
        updateProviderDto.setInfo(provider.getInfo());
        updateProviderDto.setExistingImages(provider.getImages());
        updateProviderDto.setIsActive(provider.getIsActive());

        return updateProviderDto;
    }

    public List<ProviderListDto> getAllProviders() {
        List<Provider> providers = providerRepository.findAll();

        List<ProviderListDto> providerDtos = providers.stream()
                .filter(provider -> provider.getRoles().stream()
                        .anyMatch(role -> role.getName().equals("PROVIDER")))
                .map(provider -> providerListToDto.toDto(provider))
                .collect(Collectors.toList()); // Collect results into a list

        return providerDtos;
    }


    @Transactional
    public void deleteProvider(Long userId) {
        try {
            Provider provider = providerRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Provider", "id", userId));
            provider.getRoles().clear();
            providerRepository.delete(provider);

                if (provider.getImages() != null) {
                    for (String imagePath : provider.getImages()) {
                        imageUtils.deleteImage(imagePath); // Implement this method to delete the image from the filesystem
                    }
                }

        } catch (Exception e) {
            System.out.println("Error during deletion: " + e.getMessage());
            e.printStackTrace();
        }
    }


    }