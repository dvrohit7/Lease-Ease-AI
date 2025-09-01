package com.example.auth.config;

import com.example.auth.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .cors(Customizer.withDefaults())
                // 🔧 ADD: make Spring auto-save SecurityContext to HttpSession
                .securityContext(sc -> sc.requireExplicitSave(false))
                // 🔧 ADD: allow session (we are using JSESSIONID)

                .authorizeHttpRequests(auth -> auth
                        // Preflight
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        // Public auth endpoints
                        .requestMatchers(
                                "/api/login", "/api/register",
                                "/api/forgot-password", "/api/reset-password",
                                "/api/owner/login", "/api/owner/register",
                                "/api/owner/forgot-password", "/api/owner/reset-password",
                                "/api/ping"
                        ).permitAll()

                        // Public reads
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/properties", "/api/properties/all", "/uploads/**"
                        ).permitAll()

                        // Protected business endpoints (examples)
                        .requestMatchers(org.springframework.http.HttpMethod.POST,
                                "/api/properties/create-with-image"
                        ).authenticated()
                        .requestMatchers("/api/bookings/**").authenticated()
                        .requestMatchers("/api/properties/mine").authenticated()

                        // Everything else under /api/** requires auth
                        .requestMatchers("/api/**").authenticated()

                        // Non-API open
                        .anyRequest().permitAll()
                )
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        // patterns so any dev port works (3000, 5173, etc.)
        cfg.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "http://[::1]:*"
        ));
        cfg.setAllowCredentials(true);
        cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        cfg.setAllowedHeaders(List.of(
                "Authorization","Cache-Control","Content-Type","X-Requested-With","Accept","Origin"
        ));
        cfg.setExposedHeaders(List.of("Location"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
