package com.graduate.blog_service.Dto.PostDto;


import com.graduate.blog_service.models.Provider;
import com.graduate.blog_service.models.Services;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;


@Data
@AllArgsConstructor
public class FrontListPostDto {

    private Long postId;

    private Provider provider;

    private String title;

    private String content;

    private Services service;

    private List<String> images;

    private Boolean isActive;

    private Integer likes;

    private boolean likedByCurrentUser;

}
