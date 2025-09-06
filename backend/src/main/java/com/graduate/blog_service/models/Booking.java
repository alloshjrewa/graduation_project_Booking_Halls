package com.graduate.blog_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "bookings")
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private Double hallBookingPrice;

    private Double totalPrice;

    @Temporal(TemporalType.TIMESTAMP)
    private Date startAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date endAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;    // Pending , Inprogress , Completed , Cancelled

    private LocalDate createdAt;

    @ManyToOne()
    @JoinColumn(name = "user_id", referencedColumnName = "id",nullable = false)
    private User user;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(
            name = "booking_services",
            joinColumns = @JoinColumn(name = "booking_id",referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "service_id",referencedColumnName = "id"))
    private List<Services> servicesList;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(
            name = "booking_decors",
            joinColumns = @JoinColumn(name = "booking_id",referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "decor_id",referencedColumnName = "id"))
    private List<Decor> decorList;

    @ManyToOne()
    @JoinColumn(name = "hall_id", referencedColumnName = "id")
    private Hall hall;

    @OneToMany(mappedBy = "booking")
    private List<Payment> payments; // Adding the one-to-many relationship

}
