package com.example.auth.repository;

import com.example.auth.model.Owner;
import com.example.auth.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByOwner(Owner owner);
}
