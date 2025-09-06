package com.graduate.blog_service.Dto.PaymentRequest;

import com.graduate.blog_service.models.Decor;
import com.graduate.blog_service.models.Services;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaypalRequest {
    private String clientName;
    private String clientEmail;

    private double payedPrice;
    private double totalPrice;
    private String currency;

    private Long bookingID;
    private String hallName;

    private String source;
    private String paymentMethod;

    private Boolean horror;

    private List<Services> service;
    private List<Decor> decors;

    private String paymentId;
    private String payerId;

    private String returnUrl;
    private String cancelUrl;
}
