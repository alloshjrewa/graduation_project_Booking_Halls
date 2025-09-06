package com.graduate.blog_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "halls")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String location;

    @ElementCollection
    private List<String> images;

    private String description;

    @Column(nullable = false)
    private Double price_per_day;

    @Column(nullable = false)
    private Double price_per_hour;

    @Column(nullable = false)
    private Integer capacity;

    @Column(unique = true)
    private String phone;

    private Double latitude;

    private Double longitude;

    @Column(nullable = false)
    private Boolean isActive;

}
