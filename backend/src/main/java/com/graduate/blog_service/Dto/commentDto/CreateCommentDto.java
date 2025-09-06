package com.graduate.blog_service.Dto.commentDto;

import com.graduate.blog_service.models.CommenterType;
import lombok.Data;

@Data
public class CreateCommentDto {
    private String content;
    private String email;
    private Long parentId;

}