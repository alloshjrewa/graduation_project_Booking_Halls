package com.graduate.blog_service.services;

import com.graduate.blog_service.Dto.servicesDto.ServicesDto;
import com.graduate.blog_service.Dto.servicesDto.ServicesListDto;
import com.graduate.blog_service.Dto.servicesDto.UpdatedServicesDto;
import com.graduate.blog_service.exceptions.ResourceNotFoundException;
import com.graduate.blog_service.exceptions.ServiceAlreadyExistsException;
import com.graduate.blog_service.mapper.ServicesMapper;
import com.graduate.blog_service.models.Provider;
import com.graduate.blog_service.models.Services;
import com.graduate.blog_service.repositorys.ProviderRepository;
import com.graduate.blog_service.repositorys.ServiceRepository;
import com.graduate.blog_service.utils.ImageUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicesService {

    @Autowired
    private ImageUtils imageUtils;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private ServicesMapper servicesMapper;

    public ServicesDto createService(ServicesDto servicesDto, MultipartFile[] images){
        if (serviceRepository.findByName(servicesDto.getName()).isPresent()) {
            throw new ServiceAlreadyExistsException("This Service already exists");
        }
        Services services = servicesMapper.toEntity(servicesDto);

        List<String> imagePaths = new ArrayList<>();

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                String imagePath = imageUtils.saveImage(image,"/service-images/"); // Implement this to save the image
                imagePaths.add(imagePath); // Add the image path to the list
            }
        }

        services.setImages(imagePaths);

        // Convert provider IDs to Provider entities
        if (servicesDto.getProviderIds() != null) {
            List<Provider> providers = providerRepository.findAllById(servicesDto.getProviderIds());
            services.setProviders(providers);
        }

        serviceRepository.save(services);
        return servicesMapper.toDto(services);

    }




    public void updateService(Long id, UpdatedServicesDto updatedServicesDto) {
        System.out.println(updatedServicesDto);
        Services service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));

        // Check for name uniqueness if changed
        if (!service.getName().equals(updatedServicesDto.getName()) && serviceRepository.existsByName(updatedServicesDto.getName())) {
            throw new ServiceAlreadyExistsException("This Service already exists");
        }


        service.setName(updatedServicesDto.getName());
        service.setDescription(updatedServicesDto.getDescription());
        service.setPrice(updatedServicesDto.getPrice());
        service.setType(updatedServicesDto.getType());
        service.setIsActive(updatedServicesDto.getIsActive());

        // Convert provider IDs to Provider entities
        List<Provider> providers = providerRepository.findAllById(updatedServicesDto.getProviderIds());
        service.setProviders(providers); // Set the associated providers


        // Handle new images
        List<String> imagePaths = new ArrayList<>(service.getImages()); // Start with existing images

        if (updatedServicesDto.getNewImages() != null) {
            for (MultipartFile image : updatedServicesDto.getNewImages()) {
                if (!image.isEmpty()) {
                    String imagePath = imageUtils.saveImage(image,"/service-images/"); // Implement this method
                    imagePaths.add(imagePath);
                }
            }
        }

        // Handle deletion of images
        if (updatedServicesDto.getImagesToDelete() != null) {
            for (String imagePath : updatedServicesDto.getImagesToDelete()) {
                imageUtils.deleteImage(imagePath); // Implement this method to delete the image from the filesystem
                imagePaths.remove(imagePath); // Remove from the list of paths
            }
        }

        service.setImages(imagePaths); // Set updated images
        serviceRepository.save(service);
    }

    public UpdatedServicesDto getServiceById(Long id) {
        Services services = serviceRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Service" , " id " , id));

        UpdatedServicesDto updatedServicesDto = new UpdatedServicesDto();
        updatedServicesDto.setId(services.getId());
        updatedServicesDto.setName(services.getName());
        updatedServicesDto.setDescription(services.getDescription());
        updatedServicesDto.setType(services.getType());
        updatedServicesDto.setPrice(services.getPrice());
        updatedServicesDto.setExistingImages(services.getImages());
        updatedServicesDto.setIsActive(services.getIsActive());
        // Convert provider IDs to Provider entities
        // Set provider IDs
        updatedServicesDto.setProviderIds(services.getProviders().stream()
                .map(Provider::getId)
                .collect(Collectors.toList()));


        return updatedServicesDto;
    }


    public List<ServicesListDto> getAllServices() {
        List<Services> services = serviceRepository.findAll();

        List<ServicesListDto> servicesListDtos = services.stream()
                .map(service -> servicesMapper.toServicesListDto(service))
                .collect(Collectors.toList()); // Collect results into a list
        return servicesListDtos;
    }


    @Transactional
    public void deleteService(Long serviceId) {
        try {
            Services services = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new ResourceNotFoundException("Service", "id", serviceId));
            // Handle deletion of images
            if (services.getImages() != null) {
                for (String imagePath : services.getImages()) {
                    imageUtils.deleteImage(imagePath); // Implement this method to delete the image from the filesystem
                }
            }
            services.getProviders().clear();
            serviceRepository.delete(services);

        } catch (Exception e) {
            System.out.println("Error during deletion: " + e.getMessage());
            e.printStackTrace();
        }
    }

/////////////////////////////////////////////////////////////////
public Services getServiceByIdForFront(Long id) {
    Services service = serviceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));

    // Update service images
    service.setImages(service.getImages().stream()
            .map(image -> "http://localhost:8081" + image)
            .collect(Collectors.toList()));

    // Update provider images
    if (service.getProviders() != null) {
        service.getProviders().forEach(provider -> {
            provider.setImages(provider.getImages().stream()
                    .map(image -> "http://localhost:8081" + image)
                    .collect(Collectors.toList()));
        });
    }

    return service;
}

    public List<Services> getAllServicesFront() {

        List<Services> services = serviceRepository.findAll();
        List<Services> activeServices = services.stream()
                .filter(Services::getIsActive) // Keep only active halls
                .peek(service -> service.setImages(service.getImages().stream()
                        .map(image -> "http://localhost:8081" + image)
                        .collect(Collectors.toList())))
                .collect(Collectors.toList());

        return  activeServices;
    }
}
