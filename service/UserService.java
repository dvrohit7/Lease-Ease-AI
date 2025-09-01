package com.example.auth.service;

import com.example.auth.model.User;
import com.example.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired private UserRepository userRepository;

    public User registerUser(String name, String email, String password, String mobileNumber) {
        if (userRepository.findByEmail(email.toLowerCase()) != null) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setName(name);
        user.setEmail(email.toLowerCase());
        user.setPassword(password); // (plain text for demo)
        user.setMobileNumber(mobileNumber);
        return userRepository.save(user);
    }

    public User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email.toLowerCase());
        if (user == null || !password.equals(user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }

    public void updateResetPasswordToken(String token, String email) {
        User user = userRepository.findByEmail(email.toLowerCase());
        if (user == null) throw new RuntimeException("No user found with this email");
        user.setResetPasswordToken(token);
        userRepository.save(user);
    }

    public User getByResetPasswordToken(String token) {
        return userRepository.findByResetPasswordToken(token);
    }

    public void updatePassword(User user, String newPassword) {
        user.setPassword(newPassword); // (plain text for demo)
        user.setResetPasswordToken(null);
        userRepository.save(user);
    }

    public void deleteUserByEmail(String email) {
        User user = userRepository.findByEmail(email.toLowerCase());
        if (user == null) throw new RuntimeException("User not found with email: " + email);
        userRepository.delete(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase()); // may be null
    }
}
