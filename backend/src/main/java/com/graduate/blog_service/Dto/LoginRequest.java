package com.graduate.blog_service.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @Email(message = "Enter Correct Email")
    @NotEmpty(message = "email should not be empty")
    private String username;

    @NotEmpty(message = "Password is required")
    @Size(min = 8, max = 25, message = "should be between 8 and 25 characters")
    private String password;
}
