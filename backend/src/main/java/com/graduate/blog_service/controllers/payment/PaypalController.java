package com.graduate.blog_service.controllers.payment;

import com.graduate.blog_service.Dto.PaymentRequest.PaypalRequest;
import com.graduate.blog_service.services.payment.PaypalService;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@Slf4j
public class PaypalController {
    @Autowired
    private PaypalService paypalService;

    @PostMapping("/paypal-payment")
    public ResponseEntity<?> createPayment(@RequestBody PaypalRequest paypalRequest){
        try {

            Payment payment = paypalService.createPayment(paypalRequest);
            return ResponseEntity.ok(payment.toJSON()); // Return payment details
        } catch (PayPalRESTException e) {
            return ResponseEntity.status(500).body("Error creating PayPal payment: " + e.getMessage());
        }
    }


}

