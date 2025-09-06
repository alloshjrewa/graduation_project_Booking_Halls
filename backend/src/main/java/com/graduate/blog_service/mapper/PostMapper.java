package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.PostDto.CreatePostDto;
import com.graduate.blog_service.Dto.PostDto.FrontCreatePostDto;
import com.graduate.blog_service.Dto.PostDto.FrontListPostDto;
import com.graduate.blog_service.Dto.PostDto.ListPostDto;
import com.graduate.blog_service.models.Post;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper {
    Post toEntity(CreatePostDto postDto);

    FrontListPostDto toFrontDto(Post post);
    ListPostDto toListDto(Post post);
    Post toEntity(FrontCreatePostDto postDto);
    CreatePostDto toDto(Post post);
}
