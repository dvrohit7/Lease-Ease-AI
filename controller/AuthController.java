package com.example.auth.controller;

import com.example.auth.model.User;
import com.example.auth.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
// allow credentialed cookies from FE
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"}, allowCredentials = "true")
public class AuthController {

    @Autowired private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        try {
            userService.registerUser(
                    req.get("name"), req.get("email"), req.get("password"), req.get("mobileNumber")
            );
            return ResponseEntity.ok(Map.of("message", "User registered successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔑 Login that creates a Spring session (JSESSIONID cookie)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req, HttpServletRequest request) {
        try {
            User user = userService.authenticateUser(req.get("email"), req.get("password"));

            var auth = new UsernamePasswordAuthenticationToken(
                    user.getEmail(), null, java.util.List.of(new SimpleGrantedAuthority("ROLE_USER"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            request.getSession(true); // ensures JSESSIONID is issued

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful.",
                    "name", user.getName(),
                    "role", "USER"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        try {
            String token = UUID.randomUUID().toString();
            userService.updateResetPasswordToken(token, email);
            return ResponseEntity.ok(Map.of("message", "Reset token generated.", "token", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token, @RequestBody Map<String, String> req) {
        try {
            User user = userService.getByResetPasswordToken(token);
            if (user == null) return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired reset token."));
            userService.updatePassword(user, req.get("newPassword"));
            return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        try {
            userService.deleteUserByEmail(email);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
