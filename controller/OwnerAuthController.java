package com.example.auth.controller;

import com.example.auth.model.Owner;
import com.example.auth.service.OwnerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/owner")
// IMPORTANT: allow credentials so the browser accepts the JSESSIONID cookie
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"}, allowCredentials = "true")
public class OwnerAuthController {

    @Autowired
    private OwnerService ownerService;

    @PostMapping("/register")
    public Owner register(@RequestBody Owner owner) {
        return ownerService.registerOwner(owner.getName(), owner.getEmail(), owner.getPassword(), owner.getMobileNumber());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req, HttpServletRequest request) {
        try {
            // 1) Verify credentials using your existing service
            Owner owner = ownerService.authenticateOwner(req.get("email"), req.get("password"));

            // 2) Create an authenticated session (sets JSESSIONID cookie)
            var auth = new UsernamePasswordAuthenticationToken(
                    owner.getEmail(),                               // principal (username)
                    null,                                           // no credentials stored
                    List.of(new SimpleGrantedAuthority("ROLE_OWNER")) // authorities
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            request.getSession(true);     // 🔧 ADD: ensure session exists
            request.changeSessionId();    // 🔧 ADD: rotate/issue JSESSIONID


            // 3) Return a simple body (frontend doesn't need a token)
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful.",
                    "name", owner.getName(),
                    "role", "OWNER"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            String token = UUID.randomUUID().toString();
            ownerService.updateResetPasswordToken(token, email);
            return ResponseEntity.ok(Map.of(
                    "message", "Reset token generated.",
                    "token", token
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        Owner owner = ownerService.getByResetPasswordToken(token);
        if (owner == null) return "Invalid token";
        ownerService.updatePassword(owner, newPassword);
        return "Password updated successfully";
    }
}
