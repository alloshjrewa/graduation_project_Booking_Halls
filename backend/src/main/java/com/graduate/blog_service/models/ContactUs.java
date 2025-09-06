package com.graduate.blog_service.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_us")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactUs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String title;
    private String message;
    @NotNull
    private LocalDateTime createdAt = LocalDateTime.now();



}
