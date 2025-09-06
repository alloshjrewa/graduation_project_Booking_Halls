package com.graduate.blog_service.Dto.providerDto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpdateProviderDto implements Serializable {

        private Long id;

        @NotEmpty(message = "Name is required")
        @Size(min = 3, max = 20, message = "The name should be between 3 and 20 characters")
        private String name;

        @NotEmpty(message = "Please Enter Email")
        @Email(message = "invalid email")
        private String email;

        private String password;

        private String phone;

        private String serviceSpecialty;

        private String info;

        private List<String> existingImages; // Existing image paths
        private List<MultipartFile> newImages; // New images for upload
        private List<String> imagesToDelete;

        @NotNull(message = "isActive field should have value")
        private Boolean isActive;

    }