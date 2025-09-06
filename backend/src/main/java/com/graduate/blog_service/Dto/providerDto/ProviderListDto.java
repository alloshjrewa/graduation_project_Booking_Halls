package com.graduate.blog_service.Dto.providerDto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderListDto {

    private Long id;

    private String name;

    private String email;

    private String phone;

    private List<String> images;

    private Boolean isActive;
}