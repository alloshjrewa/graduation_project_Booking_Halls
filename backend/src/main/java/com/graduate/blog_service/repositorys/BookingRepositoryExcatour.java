package com.graduate.blog_service.repositorys;

import com.graduate.blog_service.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepositoryExcatour extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {}