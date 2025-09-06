package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.commentDto.CommentDto;
import com.graduate.blog_service.models.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    Comment toEntity(CommentDto commentDto);
    @Mapping(source = "user.image", target = "image")
    @Mapping(source = "user.name", target = "name")
    @Mapping(source = "user.email", target = "email")
    CommentDto toDto(Comment comment);


}