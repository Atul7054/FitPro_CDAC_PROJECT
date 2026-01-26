package com.fitpro.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("--------------------------------------------");
        System.out.println(">>> SECURITY CONFIG IS LOADING SUCCESSFULLY <<<");
        System.out.println("--------------------------------------------");

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public Endpoints
                        .requestMatchers("/api/auth/**", "/api/public/**", "/api/members/register").permitAll()

                        // Admin General
                        .requestMatchers("/api/admin/**").hasAuthority("ADMIN")

                        // --- TRAINER RULES ---
                        .requestMatchers(HttpMethod.GET, "/api/trainers/**").hasAnyAuthority("ADMIN", "TRAINER")
                        .requestMatchers(HttpMethod.PUT, "/api/trainers/**").hasAuthority("TRAINER")
                        .requestMatchers(HttpMethod.PATCH, "/api/trainers/**").hasAuthority("TRAINER") // Allow PATCH for Trainers
                        .requestMatchers(HttpMethod.POST, "/api/trainers/**").hasAuthority("ADMIN")

                        // Member General
                        .requestMatchers("/api/members/**").hasAnyAuthority("ADMIN", "MEMBER")

                        // Payment & Attendance Rules
                        .requestMatchers(HttpMethod.POST, "/api/payments/**").hasAnyAuthority("ADMIN", "MEMBER")
                        .requestMatchers(HttpMethod.POST, "/api/attendance/**").hasAuthority("ADMIN")

                        // View History
                        .requestMatchers(HttpMethod.GET, "/api/payments/**", "/api/attendance/**").hasAnyAuthority("ADMIN", "MEMBER")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));

        // 👇 ADDED "PATCH" HERE 👇
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}