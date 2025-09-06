package com.graduate.blog_service.Dto.commentDto;

import com.graduate.blog_service.models.CommenterType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDto {
    private Long id;
    private String content;
    private String name;
    private String email;
    private Long parentId;
    private CommenterType commenterType;
    private String image;

}