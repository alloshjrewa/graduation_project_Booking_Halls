package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.hallDto.HallDto;
import com.graduate.blog_service.Dto.hallDto.HallListDto;
import com.graduate.blog_service.models.Hall;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HallMapper {
    Hall toEntity(HallDto hallDto);
    HallDto toDto(Hall hall);
    HallListDto toHallListDto(Hall hall);

}