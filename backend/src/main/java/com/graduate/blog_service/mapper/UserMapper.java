package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.userDto.UserDto;
import com.graduate.blog_service.models.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserDto userDto);
    UserDto toDto(User user);
}
