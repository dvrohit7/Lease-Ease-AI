package com.example.auth.repository;

import com.example.auth.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    boolean existsByUser_EmailAndProperty_Id(String email, Long propertyId);

    // existing queries...
    List<Booking> findByUser_EmailOrderByCreatedAtDesc(String email);
    List<Booking> findByProperty_Owner_EmailOrderByCreatedAtDesc(String email);

    // ✅ Deep fetch for a single booking (user + property + owner)
    @Query("""
      select b from Booking b
        join fetch b.user u
        join fetch b.property p
        join fetch p.owner o
      where b.id = :id
    """)
    Optional<Booking> findByIdDeep(@Param("id") Long id);

    // ✅ Deep fetch list for owner’s bookings
    @Query("""
      select b from Booking b
        join fetch b.user u
        join fetch b.property p
        join fetch p.owner o
      where o.email = :ownerEmail
      order by b.createdAt desc
    """)
    List<Booking> findOwnerBookingsDeep(@Param("ownerEmail") String ownerEmail);

}