package com.graduate.blog_service.config;

import com.stripe.Stripe;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {
    @Value("${stripe.secret_key}")
    private String stripe_secret_key;

    @Bean
    public String init() {
        Stripe.apiKey = stripe_secret_key;
        return "Stripe API Key initialized";
    }
}