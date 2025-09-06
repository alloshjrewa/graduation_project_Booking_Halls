package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.adminDto.*;
import com.graduate.blog_service.models.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    User toEntity(AdminDto adminDto);
    AdminDto toDto(User user);
    UpdateAdminDto toUpdateDto(User user);
}