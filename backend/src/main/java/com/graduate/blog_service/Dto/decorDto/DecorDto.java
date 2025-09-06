package com.graduate.blog_service.Dto.decorDto;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DecorDto implements Serializable {

    @NotEmpty(message = "Name is required")
    private String name;

    @NotEmpty(message = "Type is required")
    private String type;

    @Size(max = 500, message = "Description should not exceed 500 characters")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private Double price;

    private Boolean isActive;

}