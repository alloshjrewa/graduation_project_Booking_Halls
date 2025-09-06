package com.graduate.blog_service.Dto.PostDto;


import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatedPost {

    private Long id;

    private Long provider;

    @NotEmpty(message = "Title is required")
    private String title;

    @NotEmpty(message = "Content is required")
    private String content;

    private Long service;

    private List<String> existingImages; // Existing image paths
    private List<MultipartFile> newImages; // New images for upload
    private List<String> imagesToDelete;

    private Boolean isActive;
    }

