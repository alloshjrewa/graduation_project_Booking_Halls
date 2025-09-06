package com.graduate.blog_service.Dto.userDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserListDto implements Serializable {

        private Long id;
        private String name;
        private String email;
        private Boolean isActive;

    }