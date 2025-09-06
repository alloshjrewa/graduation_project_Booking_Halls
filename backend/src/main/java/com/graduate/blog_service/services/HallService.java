package com.graduate.blog_service.services;

import com.graduate.blog_service.Dto.hallDto.*;
import com.graduate.blog_service.exceptions.HallAlreadyExistsException;
import com.graduate.blog_service.exceptions.ResourceNotFoundException;
import com.graduate.blog_service.mapper.HallMapper;
import com.graduate.blog_service.mapper.UpdateHallMapper;
import com.graduate.blog_service.models.Hall;
import com.graduate.blog_service.repositorys.HallRepository;
import com.graduate.blog_service.utils.ImageUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HallService {

    @Autowired
    private ImageUtils imageUtils;

    @Autowired
    private HallRepository hallRepository;

    @Autowired
    private HallMapper hallMapper;


    @Autowired
    private UpdateHallMapper updateHallMapper;

    public HallDto createHall(HallDto hallDto, MultipartFile[] images){
        if (hallRepository.findByName(hallDto.getName()).isPresent()) {
            throw new HallAlreadyExistsException("This Hall already exists");
        }
        Hall hall = hallMapper.toEntity(hallDto);

        List<String> imagePaths = new ArrayList<>();

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                String imagePath = imageUtils.saveImage(image,"/hall-images/"); // Implement this to save the image
                imagePaths.add(imagePath); // Add the image path to the list
            }
        }

        hall.setImages(imagePaths);
        hallRepository.save(hall);
        return hallMapper.toDto(hall);

    }




    public void updateHall(Long id, UpdatedHall updatedHall) {
        Hall hall = hallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hall", "id", id));

        // Check for name uniqueness if changed
        if (!hall.getName().equals(updatedHall.getName()) && hallRepository.existsByName(updatedHall.getName())) {
            throw new HallAlreadyExistsException("This Hall already exists");
        }

        // Update hall properties
        hall.setName(updatedHall.getName());
        hall.setLocation(updatedHall.getLocation());
        hall.setDescription(updatedHall.getDescription());
        hall.setPrice_per_day(updatedHall.getPrice_per_day());
        hall.setPrice_per_hour(updatedHall.getPrice_per_hour());
        hall.setCapacity(updatedHall.getCapacity());
        hall.setPhone(updatedHall.getPhone());
        hall.setLatitude(updatedHall.getLatitude());
        hall.setLongitude(updatedHall.getLongitude());
        hall.setIsActive(updatedHall.getIsActive());

        // Handle new images
        List<String> imagePaths = new ArrayList<>(hall.getImages()); // Start with existing images

        if (updatedHall.getNewImages() != null) {
            for (MultipartFile image : updatedHall.getNewImages()) {
                if (!image.isEmpty()) {
                    String imagePath = imageUtils.saveImage(image,"/hall-images/"); // Implement this method
                    imagePaths.add(imagePath);
                }
            }
        }

        // Handle deletion of images
        if (updatedHall.getImagesToDelete() != null) {
            for (String imagePath : updatedHall.getImagesToDelete()) {
                imageUtils.deleteImage(imagePath); // Implement this method to delete the image from the filesystem
                imagePaths.remove(imagePath); // Remove from the list of paths
            }
        }

        hall.setImages(imagePaths); // Set updated images
        hallRepository.save(hall); // Save the updated hall
    }

    public UpdatedHall getHallById(Long id) {
        Hall hall = hallRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Hall" , " id " , id));

        // Create UpdatedHall DTO and populate it
        UpdatedHall updatedHall = new UpdatedHall();
        updatedHall.setId(hall.getId());
        updatedHall.setName(hall.getName());
        updatedHall.setLocation(hall.getLocation());
        updatedHall.setDescription(hall.getDescription());
        updatedHall.setPrice_per_day(hall.getPrice_per_day());
        updatedHall.setPrice_per_hour(hall.getPrice_per_hour());
        updatedHall.setCapacity(hall.getCapacity());
        updatedHall.setIsActive(hall.getIsActive());
        updatedHall.setExistingImages(hall.getImages()); // Assuming getImages() returns List<String>
        updatedHall.setPhone(hall.getPhone());
        updatedHall.setLatitude(hall.getLatitude());
        updatedHall.setLongitude(hall.getLongitude());

        // Add the updatedHall DTO to the model

        return updatedHall;
    }
    public Hall getHallByIdForFront(Long id) {
        return hallRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Hall" , " id " , id));
    }

    public List<HallListDto> getAllHalls() {
        List<Hall> halls = hallRepository.findAll();

        List<HallListDto> hallDtos = halls.stream()
                .map(hall -> hallMapper.toHallListDto(hall))
                .collect(Collectors.toList()); // Collect results into a list
        return hallDtos;
    }
    public List<Hall> getAllHallsFront() {

        return  hallRepository.findAll();
    }

    @Transactional
    public void deleteHall(Long hallId) {
        try {
            Hall hall = hallRepository.findById(hallId)
                    .orElseThrow(() -> new ResourceNotFoundException("Hall", "id", hallId));
            // Handle deletion of images
            if (hall.getImages() != null) {
                for (String imagePath : hall.getImages()) {
                    imageUtils.deleteImage(imagePath); // Implement this method to delete the image from the filesystem
                }
            }

            hallRepository.delete(hall);

        } catch (Exception e) {
            System.out.println("Error during deletion: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
