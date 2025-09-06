package com.graduate.blog_service.Dto.paymentHistoryDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment_PaymentHistoryDto {
    private Long id;
    private double amount;

}
