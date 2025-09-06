package com.graduate.blog_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Value("${file.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/hall-images/**")
                .addResourceLocations("file:" + uploadDir + "/hall-images/");

        // Adding the resource handler for decor-images
        registry.addResourceHandler("/decor-images/**")
                .addResourceLocations("file:" + uploadDir + "/decor-images/");

        // Adding the resource handler for decor-images
        registry.addResourceHandler("/provider-images/**")
                .addResourceLocations("file:" + uploadDir + "/provider-images/");

        // Adding the resource handler for service-images
        registry.addResourceHandler("/service-images/**")
                .addResourceLocations("file:" + uploadDir + "/service-images/");

        // Adding the resource handler for decor-images
        registry.addResourceHandler("/post-images/**")
                .addResourceLocations("file:" + uploadDir + "/post-images/");

        registry.addResourceHandler("/profile-images/**")
                .addResourceLocations("file:" + uploadDir + "/profile-images/");

    }
}