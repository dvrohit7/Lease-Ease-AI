package com.example.auth.service;

import com.example.auth.model.Owner;
import com.example.auth.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    // ✅ Always returns Owner or null
    public Owner findByEmail(String email) {
        return ownerRepository.findByEmail(email.toLowerCase()).orElse(null);
    }

    // ✅ Uses Optional to check if email already exists
    public Owner registerOwner(String name, String email, String password, String mobileNumber) {
        if (ownerRepository.findByEmail(email.toLowerCase()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        Owner owner = new Owner();
        owner.setName(name);
        owner.setEmail(email.toLowerCase());
        owner.setMobileNumber(mobileNumber);
        owner.setPassword(password); // ⚠️ plain text (not secure)
        return ownerRepository.save(owner);
    }

    // ✅ Optional + filter for authentication
    public Owner authenticateOwner(String email, String password) {
        return ownerRepository.findByEmail(email.toLowerCase())
                .filter(o -> password.equals(o.getPassword()))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }

    // ✅ Uses Optional safely
    public void updateResetPasswordToken(String token, String email) {
        Owner owner = ownerRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new RuntimeException("No owner found with this email"));
        owner.setResetPasswordToken(token);
        ownerRepository.save(owner);
    }

    public Owner getByResetPasswordToken(String token) {
        return ownerRepository.findByResetPasswordToken(token);
    }

    public void updatePassword(Owner owner, String newPassword) {
        owner.setPassword(newPassword); // ⚠️ plain text (not secure)
        owner.setResetPasswordToken(null);
        ownerRepository.save(owner);
    }
}
