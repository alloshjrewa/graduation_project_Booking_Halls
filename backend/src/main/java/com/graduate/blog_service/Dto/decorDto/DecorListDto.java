package com.graduate.blog_service.Dto.decorDto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DecorListDto {
    private Long id;

    private String name;

    private String type;

    private String description;

    private Double price;

    private List<String> images;

    private Boolean isActive;
}