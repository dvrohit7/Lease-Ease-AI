package com.example.auth.repository;

import com.example.auth.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OwnerRepository extends JpaRepository<Owner, Long> {
    Optional<Owner> findByEmail(String email);
    Owner findByResetPasswordToken(String token);
}
