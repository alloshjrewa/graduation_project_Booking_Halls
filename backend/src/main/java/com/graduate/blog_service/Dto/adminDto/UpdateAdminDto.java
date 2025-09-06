package com.graduate.blog_service.Dto.adminDto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpdateAdminDto implements Serializable {

        private Long id;

        @NotEmpty(message = "Name is required")
        @Size(min = 3, max = 20, message = "The name should be between 3 and 20 characters")
        private String name;

        @NotEmpty(message = "Please Enter Email")
        @Email(message = "invalid email")
        private String email;

        private String password;

        @NotNull(message = "isActive field should have value")
        private Boolean isActive;

    }