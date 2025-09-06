package com.graduate.blog_service.Dto.adminDto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdminDto implements Serializable {

        private Long id;

        @NotEmpty(message = "Name is required")
        @Size(min = 3, max = 20, message = "The name should be between 3 and 20 characters")
        private String name;

        @NotEmpty(message = "Please Enter Email")
        @Email(message = "invalid email")
        private String email;

        @NotEmpty(message = "Password is required")
        @Size(min = 8, max = 25, message = "The password should be between 8 and 25 characters")
        @JsonIgnore
        private String password;

        @NotNull(message = "isActive field should have value")
        private Boolean isActive;

    }