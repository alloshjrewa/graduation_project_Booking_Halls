package com.graduate.blog_service.Dto.userDto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserDto {

    private Long id;

    @NotEmpty(message = "is required")
    @Size(min = 3, max = 20, message = "The name should be between 3 and 20 characters")
    private String name;

    @NotEmpty(message = "Please Enter Email")
    @Email(message = "invalid email")
    private String email;

    @NotEmpty(message = "Password is required")
    @Size(min = 8, max = 25, message = "should be between 8 and 25 characters")
    private String password;

}
