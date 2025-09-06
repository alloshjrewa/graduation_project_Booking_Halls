package com.graduate.blog_service.controllers;

import com.graduate.blog_service.Dto.apriori.BookingItemsDto;
import com.graduate.blog_service.Dto.apriori.FrequentItemsetDto;
import com.graduate.blog_service.mapper.AprioriBookingMapper;
import com.graduate.blog_service.models.Booking;
import com.graduate.blog_service.repositorys.BookingRepository;
import com.graduate.blog_service.services.AprioriService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/apriori")
public class AprioriController {

    @Autowired
    private AprioriService aprioriService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AprioriBookingMapper bookingMapper;

    @GetMapping("/run")
    public List<FrequentItemsetDto> runApriori(@RequestParam(defaultValue = "0.5") double minSupport) throws Exception {
        List<Booking> bookings = bookingRepository.findAll();
        List<BookingItemsDto> bookingItems = bookingMapper.toBookingItemsDtos(bookings);

        return aprioriService.runApriori(bookingItems, minSupport);
    }
}
