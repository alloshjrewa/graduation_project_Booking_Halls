package com.graduate.blog_service.controllers;

import com.graduate.blog_service.models.Hall;
import com.graduate.blog_service.services.HallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HallFrontController {

    private final HallService hallService;

    @GetMapping("/halls")
    public ResponseEntity<List<Hall>> getAllHall() {
        List<Hall> halls = hallService.getAllHallsFront();
        // Filter active halls and set image URLs
        List<Hall> activeHalls = halls.stream()
                .filter(Hall::getIsActive) // Keep only active halls
                .peek(hall -> hall.setImages(hall.getImages().stream()
                        .map(image -> "http://localhost:8081" + image)
                        .collect(Collectors.toList())))
                .collect(Collectors.toList());

        return ResponseEntity.ok().body(activeHalls);
    }
    @GetMapping("/hall/{id}")
    public ResponseEntity<Hall> getHallById(@PathVariable("id") Long id) {
        Hall hall = hallService.getHallByIdForFront(id);
        // Update image URLs
        List<String> updatedImages = hall.getImages().stream()
                .map(image -> "http://localhost:8081" + image)
                .collect(Collectors.toList());

        hall.setImages(updatedImages);

        return ResponseEntity.ok().body(hall);
    }


}
