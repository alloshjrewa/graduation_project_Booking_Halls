package com.graduate.blog_service.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long parentId;

    private String content;

    private Boolean isActive;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post; // Link comments to posts

    @ManyToOne
    @JoinColumn(name = "provider_id",referencedColumnName="id")
    private Provider provider;

    @Enumerated(EnumType.STRING)
    private CommenterType commenterType;

    @Override
    public String toString() {
        return "Comment{" +
                "id=" + id +
                ", content='" + content + '\'' +
                ", parentId='" + parentId + '\'' +
                ", commenterType='" + commenterType + '\'' +

                // Avoid including user directly to prevent recursion
                // ", user=" + user +
                '}';
    }
}
