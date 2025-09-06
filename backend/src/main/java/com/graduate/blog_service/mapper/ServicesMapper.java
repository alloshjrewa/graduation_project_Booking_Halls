package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.servicesDto.ServicesDto;
import com.graduate.blog_service.Dto.servicesDto.ServicesListDto;
import com.graduate.blog_service.models.Services;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ServicesMapper {
    Services toEntity(ServicesDto servicesDto);
    ServicesDto toDto(Services services);
    ServicesListDto toServicesListDto(Services services);

}