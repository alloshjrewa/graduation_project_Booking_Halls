package com.graduate.blog_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Services implements Serializable {
    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_name" , length = 50 , nullable = false)
    private String name;

    @Column(name = "service_description" , length = 500)
    private String description;

    @Column(name = "service_price", nullable = false)
    private Double price;

    @ElementCollection
    private List<String> images;

    private String type;

    private Boolean isActive;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "services_provider",
            joinColumns = @JoinColumn(name = "service_id"),
            inverseJoinColumns = @JoinColumn(name = "provider_id")
    )
    private List<Provider> providers;

}
