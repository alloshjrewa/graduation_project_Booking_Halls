package com.graduate.blog_service.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @Column(length = 100,nullable = false)
    private String title;

    @Column( length = 2000)
    private String content;

    @Column(nullable = false)
    private Integer likes = 0;


    private Set<String> likedUsers;


    @ElementCollection
    private List<String> images;

    private Boolean isActive;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id",referencedColumnName = "id")
    private Services services;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "provider_id" , referencedColumnName = "id")
    private Provider provider;

    @JsonIgnore
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

}
