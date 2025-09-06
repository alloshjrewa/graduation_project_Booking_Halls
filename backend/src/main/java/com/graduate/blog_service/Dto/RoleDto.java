package com.graduate.blog_service.Dto;

import jakarta.validation.constraints.NotNull;

public record RoleDto(
        Long id,
        @NotNull(message = "Role Name is Required")
        String roleName
) {
}
