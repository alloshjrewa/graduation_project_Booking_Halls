package com.graduate.blog_service.Dto.hallDto;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class HallDto implements Serializable {

    @NotEmpty(message = "Name is required")
    private String name;

    @NotEmpty(message = "Location is required")
    private String location;

    @Size(max = 500, message = "Description should not exceed 500 characters")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private Double price_per_day;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private Double price_per_hour;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private String phone;

    private Double latitude;

    private Double longitude;

    private Boolean isActive;

    public HallDto() {
    }
}