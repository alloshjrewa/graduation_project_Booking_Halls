package com.graduate.blog_service.controllers;

import com.graduate.blog_service.Dto.bookingDto.BookingRequest;
import com.graduate.blog_service.Dto.apriori.BookingItemsDto;
import com.graduate.blog_service.Dto.bookingDto.BookingFrontDto;
import com.graduate.blog_service.mapper.AprioriBookingMapper;
import com.graduate.blog_service.models.Booking;
import com.graduate.blog_service.models.BookingStatus;
import com.graduate.blog_service.models.Payment;
import com.graduate.blog_service.repositorys.BookingRepository;
import com.graduate.blog_service.repositorys.PaymentRepository;
import com.graduate.blog_service.services.BookingService;
import com.graduate.blog_service.services.payment.PaypalService;
import com.graduate.blog_service.services.payment.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingFrontController {
    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaypalService paypalService;
    @Autowired
    private AprioriBookingMapper BookingMapper;

    @Autowired
    private StripeService stripeService;

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/check-availability")

    public ResponseEntity<?> checkAvailability(@RequestParam Long hallId,
                                            @RequestParam String  startAt,
                                            @RequestParam String endAt) {
        try {
            Date startDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").parse(startAt);
            Date endDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").parse(endAt);

            Map<String,Boolean> response =  new HashMap<>();
            response.put("isBooked", bookingService.isAvailable(hallId, startDate, endDate));

            return ResponseEntity.ok().body(response);
        } catch (ParseException e) {

            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date format", e);
        }
    }

    @PostMapping()
    public ResponseEntity<?> bookHall(@RequestBody BookingRequest bookingRequest){


        return ResponseEntity.ok().body(bookingService.createBooking(bookingRequest));
    }
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBooking(@PathVariable("bookingId")  Long id){
        return ResponseEntity.ok().body(bookingService.getBooking(id).getId());
    }

    @GetMapping("/search")
    public ResponseEntity<List<BookingFrontDto>> getBookings(@RequestParam("username") String username){
        return ResponseEntity.ok(bookingService.getBookingsByUserId(username));
    }
    @GetMapping
    public ResponseEntity<List<BookingItemsDto>> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        List<BookingItemsDto> dtoList = BookingMapper.toBookingItemsDtos(bookings);
        return ResponseEntity.ok(dtoList);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> bookHall(@PathVariable("id") @RequestBody Long id){
        bookingService.deleteBooking(id);

        return ResponseEntity.ok().build();
    }
    @PatchMapping("/{bookingId}/refund")
    public ResponseEntity<?> refundBooking(@PathVariable("bookingId") Long bookingId) {
        try {
            Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
            if(booking.getTotalPrice() == null){
                booking.setStatus(BookingStatus.Cancelled);
                booking.setTotalPrice(booking.getHallBookingPrice());
                bookingRepository.save(booking);

                return ResponseEntity.ok("Cancelled  successfully");

            }
                // Find payments with horror = false (0) for the given bookingId
                List<Payment> payments = paymentRepository.findByBookingIdAndHorror(bookingId, false);

                    if (payments.isEmpty()) {
                        return ResponseEntity.ok("Cancelled  successfully And Nothing Refunded");
                    }

                    // Iterate through the payments and process the refund
                    for (Payment payment : payments) {
                        if ("Stripe".equalsIgnoreCase(payment.getPaymentMethod())) {
                            stripeService.refundBooking(payment);
                        } else if ("PayPal".equalsIgnoreCase(payment.getPaymentMethod())) {
                            paypalService.refundBooking(payment);
                        } else {
                            return ResponseEntity.badRequest().body("Invalid payment type for payment ID: " + payment.getId());
                        }
                    }

                    return ResponseEntity.ok("Refund initiated successfully for eligible payments");

                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Refund failed: " + e.getMessage());
                }
            }

    }


