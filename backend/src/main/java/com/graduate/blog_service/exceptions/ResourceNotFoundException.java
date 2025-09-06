package com.graduate.blog_service.exceptions;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ResourceNotFoundException extends RuntimeException{

    String resourceName;
    String fieldName;
    Long fieldValue;

    public ResourceNotFoundException(String resourceName , String fieldName , Long fieldValue){
        super(String.format("%s not found with %s : %d" ,resourceName , fieldName , fieldValue ));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
}
