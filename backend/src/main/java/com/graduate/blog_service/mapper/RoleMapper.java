package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.RoleDto;
import com.graduate.blog_service.models.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    Role toEntity(RoleDto roleDto);
    RoleDto toDto(Role role);
}
