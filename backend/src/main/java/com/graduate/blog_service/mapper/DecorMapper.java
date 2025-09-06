package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.decorDto.DecorDto;

import com.graduate.blog_service.Dto.decorDto.DecorListDto;
import com.graduate.blog_service.models.Decor;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DecorMapper {
    Decor toEntity(DecorDto decorDto);
    DecorDto toDto(Decor decor);
    DecorListDto toListDecorDto(Decor hall);

}