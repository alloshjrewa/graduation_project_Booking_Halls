package com.graduate.blog_service.Dto.hallDto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatedHall {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    @Size(max = 500, message = "Description should not exceed 500 characters")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private Double price_per_day;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private Double price_per_hour;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private List<String> existingImages; // Existing image paths
    private List<MultipartFile> newImages; // New images for upload
    private List<String> imagesToDelete;

    private String phone;

    private Double latitude;

    private Double longitude;

    private Boolean isActive;
    }

