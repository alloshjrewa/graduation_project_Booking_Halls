package com.graduate.blog_service.Dto.PostDto;


import com.graduate.blog_service.models.Provider;
import com.graduate.blog_service.models.Services;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
public class CreatePostDto {
    @NotNull(message = "Provider is required")
    private Provider provider;

    private String title;

    private String content;

    private Services service;

    private Boolean isActive;

    private LocalDateTime createdAt;

}
