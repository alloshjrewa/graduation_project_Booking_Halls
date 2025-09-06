package com.graduate.blog_service.Dto.apriori;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class BookingItemsDto {
    private List<String> services;
    private List<String> decors;

    public BookingItemsDto(List<String> services, List<String> decors) {
        this.services = services;
        this.decors = decors;
    }

    public List<String> getAllItems() {
        List<String> all = new ArrayList<>();
        if (services != null) all.addAll(services);
        if (decors != null) all.addAll(decors);
        return all;
    }
}
