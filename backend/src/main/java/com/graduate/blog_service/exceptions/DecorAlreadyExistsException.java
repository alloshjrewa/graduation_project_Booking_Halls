package com.graduate.blog_service.exceptions;

public class DecorAlreadyExistsException extends RuntimeException {
    public DecorAlreadyExistsException(String message) {
        super(message);
    }
}