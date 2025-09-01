package com.example.auth.service;

import com.example.auth.dto.BookingDTO;
import com.example.auth.model.Booking;
import com.example.auth.model.BookingStatus;
import com.example.auth.repository.BookingRepository;
import com.example.auth.repository.PropertyRepository;
import com.example.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;
    private final PropertyRepository propertyRepo;

    @Transactional
    public BookingDTO create(String userEmail, Long propertyId) {
        var user = userRepo.findByEmail(userEmail);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + userEmail);
        }

        var property = propertyRepo.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Property not found: " + propertyId));

        // prevent duplicate pending bookings
        if (bookingRepo.existsByUser_EmailAndProperty_Id(userEmail, propertyId)) {
            throw new IllegalStateException("You already requested this property.");
        }

        var booking = Booking.builder()
                .user(user)
                .property(property)
                .status(BookingStatus.PENDING)
                .build();

        return BookingDTO.from(bookingRepo.save(booking), false); // ❌ don’t share contacts on creation
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> userBookings(String userEmail) {
        return bookingRepo.findByUser_EmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(b -> BookingDTO.from(b, false))  // ❌ users don’t need to see their own phone again
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> ownerBookings(String ownerEmail) {
        return bookingRepo.findByProperty_Owner_EmailOrderByCreatedAtDesc(ownerEmail)
                .stream()
                .map(b -> BookingDTO.from(b, b.getStatus() == BookingStatus.APPROVED))
                // ✅ include contact only if APPROVED
                .toList();
    }

    @Transactional
    public BookingDTO approve(Long bookingId, String ownerEmail) {
        var booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        var propOwnerEmail = booking.getProperty().getOwner().getEmail();
        if (!propOwnerEmail.equalsIgnoreCase(ownerEmail)) {
            throw new SecurityException("Not allowed to approve this booking");
        }

        booking.setStatus(BookingStatus.APPROVED);
        return BookingDTO.from(bookingRepo.save(booking), true); // ✅ share contact on approval
    }

    @Transactional
    public BookingDTO reject(Long bookingId, String ownerEmail) {
        var booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        var propOwnerEmail = booking.getProperty().getOwner().getEmail();
        if (!propOwnerEmail.equalsIgnoreCase(ownerEmail)) {
            throw new SecurityException("Not allowed to reject this booking");
        }

        booking.setStatus(BookingStatus.REJECTED);
        return BookingDTO.from(bookingRepo.save(booking), false); // ❌ don’t expose contact
    }
}
