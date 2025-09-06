package com.graduate.blog_service.controllers.payment;

import com.graduate.blog_service.Dto.PaymentRequest.StripeRequest;
import com.graduate.blog_service.services.payment.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class StripeController {

    @Autowired
    private StripeService stripeService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@RequestBody StripeRequest stripeRequest) throws Exception {
        try {
            Map<String, Object> paymentIntentResponse = stripeService.createPaymentIntent(stripeRequest);
            return ResponseEntity.ok(paymentIntentResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", e.getMessage()));
        }
    }

}