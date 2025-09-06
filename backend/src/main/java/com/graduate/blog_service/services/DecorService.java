package com.graduate.blog_service.services;

import com.graduate.blog_service.Dto.decorDto.DecorDto;
import com.graduate.blog_service.Dto.decorDto.DecorListDto;
import com.graduate.blog_service.Dto.decorDto.UpdatedDecor;
import com.graduate.blog_service.exceptions.DecorAlreadyExistsException;
import com.graduate.blog_service.exceptions.ResourceNotFoundException;
import com.graduate.blog_service.mapper.DecorMapper;
import com.graduate.blog_service.models.Decor;
import com.graduate.blog_service.repositorys.DecorRepository;
import com.graduate.blog_service.utils.ImageUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DecorService {

    @Autowired
    private ImageUtils imageUtils;

    @Autowired
    private DecorRepository decorRepository;

    @Autowired
    private DecorMapper decorMapper;


    public DecorDto createDecor(DecorDto decorDto, MultipartFile[] images){
        if (decorRepository.findByName(decorDto.getName()).isPresent()) {
            throw new DecorAlreadyExistsException("This Decor already exists");
        }
        Decor decor = decorMapper.toEntity(decorDto);

        List<String> imagePaths = new ArrayList<>();

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                String imagePath = imageUtils.saveImage(image,"/decor-images/"); // Implement this to save the image
                imagePaths.add(imagePath); // Add the image path to the list
            }
        }

        decor.setImages(imagePaths);

        decorRepository.save(decor);
        return decorMapper.toDto(decor);

    }




    public void updateDecor(Long id, UpdatedDecor updatedDecor) {
        Decor decor = decorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Decor", "id", id));

        // Check for name uniqueness if changed
        if (!decor.getName().equals(updatedDecor.getName()) && decorRepository.existsByName(updatedDecor.getName())) {
            throw new DecorAlreadyExistsException("This Decor already exists");
        }

        // Update Decor properties
        decor.setName(updatedDecor.getName());
        decor.setType(updatedDecor.getType());
        decor.setDescription(updatedDecor.getDescription());
        decor.setPrice(updatedDecor.getPrice());
        decor.setIsActive(updatedDecor.getIsActive());

        // Handle new images
        List<String> imagePaths = new ArrayList<>(decor.getImages()); // Start with existing images

        if (updatedDecor.getNewImages() != null) {
            for (MultipartFile image : updatedDecor.getNewImages()) {
                if (!image.isEmpty()) {
                    String imagePath = imageUtils.saveImage(image,"/decor-images/"); // Implement this method
                    imagePaths.add(imagePath);
                }
            }
        }

        // Handle deletion of images
        if (updatedDecor.getImagesToDelete() != null) {
            for (String imagePath : updatedDecor.getImagesToDelete()) {
                imageUtils.deleteImage(imagePath); // Implement this method to delete the image from the filesystem
                imagePaths.remove(imagePath); // Remove from the list of paths
            }
        }

        decor.setImages(imagePaths); // Set updated images
        decorRepository.save(decor); // Save the updated Decor
    }

    public UpdatedDecor getDecorById(Long id) {
        Decor decor = decorRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Decor" , " id " , id));

        // Create UpdatedDecor DTO and populate it
        UpdatedDecor updatedDecor= new UpdatedDecor();
        updatedDecor.setId(decor.getId());
        updatedDecor.setName(decor.getName());
        updatedDecor.setType(decor.getType());
        updatedDecor.setDescription(decor.getDescription());
        updatedDecor.setPrice(decor.getPrice());
        updatedDecor.setIsActive(decor.getIsActive());
        updatedDecor.setExistingImages(decor.getImages()); // Assuming getImages() returns List<String>

        // Add the updatedDecor DTO to the model

        return updatedDecor;
    }

    public List<DecorListDto> getAllDecors() {
        List<Decor> decors = decorRepository.findAll();

        List<DecorListDto> decorDtos = decors.stream()
                .map(decor -> decorMapper.toListDecorDto(decor))
                .collect(Collectors.toList()); // Collect results into a list
        return decorDtos;
    }




    @Transactional
    public void deleteDecor(Long decorId) {
        try {
            Decor decor = decorRepository.findById(decorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Decor", "id", decorId));
            // Handle deletion of images
            if (decor.getImages() != null) {
                for (String imagePath : decor.getImages()) {
                    imageUtils.deleteImage(imagePath); // Implement this method to delete the image from the filesystem
                }
            }
            decorRepository.delete(decor);

        } catch (Exception e) {
            System.out.println("Error during deletion: " + e.getMessage());
            e.printStackTrace();
        }
    }
///////////////////////////////////////////////////////////
    public Decor getDecorByIdForFront(Long id) {
        Decor decor = decorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Decor", "id", id));

        // Update service images
        decor.setImages(decor.getImages().stream()
                .map(image -> "http://localhost:8081" + image)
                .collect(Collectors.toList()));
        return decor;
    }

    public List<Decor> getAllDecorsFront() {
        List<Decor> decors = decorRepository.findAll();
        List<Decor> activeDecors = decors.stream()
                .filter(Decor::getIsActive) // Keep only active halls
                .peek(decor -> decor.setImages(decor.getImages().stream()
                        .map(image -> "http://localhost:8081" + image)
                        .collect(Collectors.toList())))
                .collect(Collectors.toList());
        return activeDecors;
    }
}
