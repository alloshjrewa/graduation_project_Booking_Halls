package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.userDto.UserListDto;
import com.graduate.blog_service.models.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserListToDto {

    UserListDto toDto(User user);

}