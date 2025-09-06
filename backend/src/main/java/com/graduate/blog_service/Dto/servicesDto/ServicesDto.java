package com.graduate.blog_service.Dto.servicesDto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
public class ServicesDto implements Serializable {

    @NotEmpty(message = "Name is required")
    private String name;

    private List<Long> providerIds;

    @Size(max = 500, message = "Description should not exceed 500 characters")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private Double price;

    private String type;

    private Boolean isActive;

}