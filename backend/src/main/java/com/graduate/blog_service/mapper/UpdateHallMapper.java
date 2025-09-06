package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.hallDto.UpdatedHall;
import com.graduate.blog_service.models.Hall;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UpdateHallMapper {
    Hall toEntity(UpdatedHall updatedHall);
    UpdatedHall toDto(Hall hall);

}