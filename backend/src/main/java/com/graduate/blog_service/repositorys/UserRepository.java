package com.graduate.blog_service.repositorys;

import com.graduate.blog_service.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    /// //////////////////dashboard////////////////////

    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = :roleName")
    long countByRoleName(@Param("roleName") String roleName);

    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r " +
            "WHERE r.name = :roleName AND u.createdAt BETWEEN :start AND :end")
    long countByRoleNameAndCreatedAtBetween(@Param("roleName") String roleName,
                                            @Param("start") LocalDateTime start,
                                            @Param("end") LocalDateTime end);
}
