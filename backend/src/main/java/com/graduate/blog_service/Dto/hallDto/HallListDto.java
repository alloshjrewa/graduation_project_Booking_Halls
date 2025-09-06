package com.graduate.blog_service.Dto.hallDto;


import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HallListDto {

    private Long id;

    private String name;

    private String location;

    private String description;

    private Double price_per_day;

    private Double price_per_hour;

    private Integer capacity;

    private List<String> images;

    private Boolean isActive;
}