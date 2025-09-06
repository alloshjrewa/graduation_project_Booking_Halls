package com.graduate.blog_service.Dto.commentDto;

import lombok.Data;

@Data
public class LikeRequestDto {
    private boolean liked;
    private String userEmail; // Ensure this is a Long, not a String
}
