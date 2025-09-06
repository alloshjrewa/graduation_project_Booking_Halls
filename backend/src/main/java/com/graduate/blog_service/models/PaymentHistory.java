package com.graduate.blog_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "payment_history")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentHistory  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    private String timestamp;
    private String details; // Additional details if needed
}