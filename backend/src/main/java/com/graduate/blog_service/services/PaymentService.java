package com.graduate.blog_service.services;

import com.graduate.blog_service.models.*;
import com.graduate.blog_service.repositorys.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private BookingRepository bookingRepository;

    public List<Payment> getAllPayments(){
        return paymentRepository.findAll();
    }

    /// /////////////////dashboard////////////////

    public double getTotalPayment() {
        return paymentRepository.sumAllPayments();
    }

    public double getTodayPayment() {
        return paymentRepository.getTotalPaymentBetween(
                LocalDate.now().atStartOfDay(),
                LocalDate.now().plusDays(1).atStartOfDay()
        );
    }

    public double getTotalPaymentMonth(LocalDate startDate, LocalDate endDate) {
        return paymentRepository.getTotalPaymentBetween(
                startDate.atStartOfDay(),
                endDate.plusDays(1).atStartOfDay()
        );
    }

}

