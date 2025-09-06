package com.graduate.blog_service.services;


import com.graduate.blog_service.Dto.paymentHistoryDto.PaymentHistoryDto;
import com.graduate.blog_service.mapper.PaymentHistoryMapper;
import com.graduate.blog_service.models.*;
import com.graduate.blog_service.repositorys.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentHistoryService {



    @Autowired
    private PaymentHistoryMapper paymentHistoryMapper;

    @Autowired
    private PaymentHistoryRepository paymentHistoryRepository;

    public List<PaymentHistory> getAllHistory(){
        return paymentHistoryRepository.findAll();
    }


    ///////////////////////////////front///////////////////////

    public List<PaymentHistoryDto> getPaymentForUser(String email) {
        List<PaymentHistoryDto> paymentHistory = paymentHistoryRepository.findByUserEmail(email).stream().map((his) -> paymentHistoryMapper.toDto(his)).toList();

     return paymentHistory;
    }

}
