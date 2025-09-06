package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.paymentHistoryDto.PaymentHistoryDto;
import com.graduate.blog_service.models.PaymentHistory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentHistoryMapper {
    PaymentHistoryDto toDto(PaymentHistory paymentHistory);

}