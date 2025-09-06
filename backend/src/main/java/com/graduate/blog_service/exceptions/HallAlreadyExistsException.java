package com.graduate.blog_service.exceptions;

public class HallAlreadyExistsException extends RuntimeException {
    public HallAlreadyExistsException(String message) {
        super(message);
    }
}