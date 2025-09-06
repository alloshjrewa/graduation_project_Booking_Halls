package com.graduate.blog_service.controllers;

import com.graduate.blog_service.Dto.paymentHistoryDto.PaymentHistoryDto;
import com.graduate.blog_service.services.PaymentHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/")
public class PaymentHistoryFrontController {

    @Autowired
    private PaymentHistoryService paymentHistoryService;

    @GetMapping("/paymenthistory/{email}")
    public ResponseEntity<List<PaymentHistoryDto>> getAllPaymentHistory(@PathVariable("email") String email){

        return ResponseEntity.ok().body(paymentHistoryService.getPaymentForUser(email));
    }
}
