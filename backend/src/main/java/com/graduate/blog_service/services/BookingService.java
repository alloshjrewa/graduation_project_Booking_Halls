package com.graduate.blog_service.services;

import com.graduate.blog_service.Dto.bookingDto.BookingRequest;
import com.graduate.blog_service.Dto.bookingDto.BookingFrontDto;
import com.graduate.blog_service.exceptions.ResourceNotFoundException;
import com.graduate.blog_service.mapper.BookingMapper;
import com.graduate.blog_service.models.*;
import com.graduate.blog_service.repositorys.*;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private BookingRepositoryExcatour bookingRepositoryExcatour;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private HallRepository hallRepository;
    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingMapper bookingMapper;

    public List<Booking> getAllBookings(){
        return bookingRepository.findAll();
    }
    public List<Booking> searchBookings(String name, String email, String phone,
                                        LocalDate startAt, LocalDate endAt) {
        return bookingRepositoryExcatour.findAll((root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            if (name != null && !name.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("user").get("name")),
                        "%" + name.toLowerCase() + "%"));
            }
            if (email != null && !email.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("user").get("email")),
                        "%" + email.toLowerCase() + "%"));
            }
            if (phone != null && !phone.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("user").get("phone")),
                        "%" + phone.toLowerCase() + "%"));
            }
            if (startAt != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startAt"), startAt.atStartOfDay()));
            }
            if (endAt != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("endAt"), endAt.atTime(23, 59, 59)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        });
    }
    public Booking getBookingById(Long id){
        return bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking" , "id" , id));
    }


    ////////////////////////////front//////////////////////////////

    @Transactional
    public Map<String,Long> createBooking(BookingRequest bookingRequest) {
        Booking booking = new Booking();
        booking.setStartAt(bookingRequest.getStartTime());
        booking.setEndAt(bookingRequest.getEndTime());
        booking.setStatus(BookingStatus.Pending); // Set initial status

        // Set the user based on the userId
        User user = userRepository.findByEmail(bookingRequest.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        booking.setUser(user);
        user.setPhone(bookingRequest.getPhone());
        user.setName(bookingRequest.getClientName());
        userRepository.save(user);

        // Set the hall based on the hallId
        Hall hall = hallRepository.findById(bookingRequest.getHallId()).orElseThrow(() -> new RuntimeException("Hall not found"));
        booking.setHall(hall);

        double price = calculatePrice(hall, bookingRequest.getStartTime(), bookingRequest.getEndTime());

        booking.setHallBookingPrice(price);

        booking.setCreatedAt(LocalDate.now());
        booking.setType(bookingRequest.getEventType());
        bookingRepository.save(booking);
        Map<String,Long> response =  new HashMap<>();
        response.put("bookingId", bookingRepository.save(booking).getId());
        response.put("finalPrice",  (long) price);
        return response;

    }
    private double calculatePrice(Hall hall, Date startTime, Date endTime) {
        Instant startInstant = startTime.toInstant();
        Instant endInstant = endTime.toInstant();

        Duration duration = Duration.between(startInstant, endInstant);
        long hours = duration.toHours();

        if (hours <= 6) {
            // Calculate hourly price
            return hours * hall.getPrice_per_hour(); // Assuming Hall has a method getPricePerHour()
        } else {
            // Calculate daily price
            return hall.getPrice_per_day(); // Assuming Hall has a method getPricePerDay()
        }

    }


    public Boolean isAvailable(Long hallId, Date startAt, Date endAt) {
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(hallId, startAt, endAt);
        boolean res = true;
        if (overlappingBookings.isEmpty()) {
            System.out.println("Emptyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
            return true; // Hall is available for booking
        }

        // Check if ALL overlapping bookings have status "pending" or "cancel"
        for (Booking booking : overlappingBookings) {
            System.out.println(booking.getStatus());
            if (booking.getStatus().equals(BookingStatus.InProgress)){
                res =  false;
            }else if (booking.getStatus().equals(PaymentStatus.Completed)) {
                res =  false;
            }
        }
        return res;


    }

    public List<BookingFrontDto> getBookingsByUserId(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        return bookings.stream()
                .map(bookingMapper::toDto)
                .toList();
    }

    @Transactional
    public void deleteBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Set booking_id = null in all related payments
        booking.getPayments().forEach(payment -> payment.setBooking(null));
        paymentRepository.saveAll(booking.getPayments());

        bookingRepository.delete(booking);
    }

    public BookingFrontDto getBooking(Long id){
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        return bookingMapper.toDto(booking);
    }

    /// //////////////////////////dashboard////////////////////
    public long getTotalBooking() {
        return bookingRepository.count();
    }

    public long getTodayBooking() {
        LocalDate today = LocalDate.now();
        return bookingRepository.countByCreatedAtBetween(today, today);
    }
    public List<Booking> getLatestBooking() {
        return bookingRepository.findTop10ByOrderByCreatedAtDesc();
    }

    public long getTotalBookingMonth(LocalDate startDate, LocalDate endDate) {
        return bookingRepository.countByCreatedAtBetween(startDate, endDate);
    }
}

