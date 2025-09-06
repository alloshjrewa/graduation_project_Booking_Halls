package com.graduate.blog_service.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "decors")
@Data
public class Decor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
    private String description;
    private String type;
    private Double price;

    @ElementCollection
    private List<String> images;

    private Boolean isActive;

}
