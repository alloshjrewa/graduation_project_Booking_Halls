package com.graduate.blog_service.Dto.apriori;

import lombok.Data;

import java.util.List;

@Data
public class FrequentItemsetDto {
    private List<String> items;
    private int support;

    public FrequentItemsetDto(List<String> items, int support) {
        this.items = items;
        this.support = support;
    }
}
