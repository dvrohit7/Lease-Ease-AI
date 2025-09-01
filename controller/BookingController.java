package com.example.auth.controller;
import com.example.auth.dto.BookingDTO;
import com.example.auth.service.BookingService;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"}, allowCredentials = "true")
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping("/{propertyId}")
    public BookingDTO create(@PathVariable Long propertyId, Principal principal) {
        if (principal == null) throw new RuntimeException("Not authenticated");
        return bookingService.create(principal.getName(), propertyId);
    }

    @GetMapping("/mine")
    public List<BookingDTO> myBookings(Principal principal) {
        if (principal == null) throw new RuntimeException("Not authenticated");
        return bookingService.userBookings(principal.getName());
    }

    @GetMapping("/owner")
    public List<BookingDTO> ownerBookings(Principal principal) {
        if (principal == null) throw new RuntimeException("Not authenticated");
        return bookingService.ownerBookings(principal.getName());
    }

    @PatchMapping("/{id}/approve")
    public BookingDTO approve(@PathVariable Long id, Principal principal) {
        if (principal == null) throw new RuntimeException("Not authenticated");
        return bookingService.approve(id, principal.getName());
    }

    @PatchMapping("/{id}/reject")
    public BookingDTO reject(@PathVariable Long id, Principal principal) {
        if (principal == null) throw new RuntimeException("Not authenticated");
        return bookingService.reject(id, principal.getName());
    }
}
