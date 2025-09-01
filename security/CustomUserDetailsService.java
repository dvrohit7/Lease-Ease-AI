package com.example.auth.security;

import com.example.auth.model.Owner;
import com.example.auth.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private OwnerRepository ownerRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Owner owner = ownerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Owner not found with email: " + email));

        // ✅ Use {noop} so password is compared as plain text (since you are not using BCrypt yet)
        return User.builder()
                .username(owner.getEmail())
                .password("{noop}" + owner.getPassword())
                .roles("OWNER")
                .build();
    }
}
