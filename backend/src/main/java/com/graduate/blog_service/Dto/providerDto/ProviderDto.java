package com.graduate.blog_service.Dto.providerDto;

import jakarta.persistence.Column;
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
public class ProviderDto implements Serializable {

        private Long id;

        @NotEmpty(message = "Name is required")
        @Size(min = 3, max = 20, message = "The name should be between 3 and 20 characters")
        private String name;

        @NotEmpty(message = "Please Enter Email")
        @Email(message = "invalid email")
        private String email;

        @NotEmpty(message = "Password is required")
        @Size(min = 8, max = 25, message = "The password should be between 8 and 25 characters")
        private String password;

        private String phone;

        private String serviceSpecialty;

        private String info;

        @NotNull(message = "isActive field should have value")
        private Boolean isActive;

    }