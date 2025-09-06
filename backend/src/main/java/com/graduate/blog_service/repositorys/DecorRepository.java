package com.graduate.blog_service.repositorys;

import com.graduate.blog_service.models.Decor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DecorRepository extends JpaRepository<Decor,Long> {
    Optional<Decor> findByName(String name);
    boolean existsByName(String name);
}
