package com.graduate.blog_service.Dto.PostDto;


import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class FrontCreatePostDto {
    @NotEmpty(message = "Provider is required")
    private String provider_email;

    @NotEmpty(message = "Title is required")
    private String title;

    @NotEmpty(message = "Content is required")
    private String content;

    private Long service;


}
