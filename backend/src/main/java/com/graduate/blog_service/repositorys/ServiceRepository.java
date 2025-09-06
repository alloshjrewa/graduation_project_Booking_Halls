package com.graduate.blog_service.repositorys;

import com.graduate.blog_service.models.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Services,Long> {

    Optional<Services> findByName(String name);
    boolean existsByName(String name);
}
