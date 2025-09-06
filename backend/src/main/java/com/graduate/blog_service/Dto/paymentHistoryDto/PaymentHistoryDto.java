package com.graduate.blog_service.Dto.paymentHistoryDto;

import com.graduate.blog_service.Dto.userDto.UserDto;
import com.graduate.blog_service.models.Payment;
import com.graduate.blog_service.models.User;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class PaymentHistoryDto  {
    private Long id;

    private User_PaymentHistoryDto user;

    private Payment_PaymentHistoryDto payment;

    private String timestamp;
    private String details;
}
