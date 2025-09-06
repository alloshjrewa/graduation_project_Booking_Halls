package com.graduate.blog_service.Dto.servicesDto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicesListDto {

    private Long id;

    private String name;

    private Double price;

    private String type;

    private List<String> images;

    private Boolean isActive;
}