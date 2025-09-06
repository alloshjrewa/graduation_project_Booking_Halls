package com.graduate.blog_service.repositorys;

import com.graduate.blog_service.models.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Optional;

@ResponseBody
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByEmail(String email);
}
