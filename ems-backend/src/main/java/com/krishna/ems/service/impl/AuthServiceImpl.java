package com.krishna.ems.service.impl;

import com.krishna.ems.dto.request.LoginRequest;
import com.krishna.ems.dto.request.RegisterRequest;
import com.krishna.ems.dto.response.AuthResponse;
import com.krishna.ems.entity.*;
import com.krishna.ems.exception.DuplicateResourceException;
import com.krishna.ems.exception.ResourceNotFoundException;
import com.krishna.ems.repository.EmployeeRepository;
import com.krishna.ems.repository.UserRepository;
import com.krishna.ems.security.JwtUtil;
import com.krishna.ems.service.AuditLogService;
import com.krishna.ems.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.EMPLOYEE)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        // Auto-provision a basic employee profile; admin completes department/designation/salary later
        String code = "EMP-" + String.format("%05d", employeeRepository.count() + 1);
        Employee employee = Employee.builder()
                .employeeCode(code)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .designation("Not Assigned")
                .salary(java.math.BigDecimal.ZERO)
                .joiningDate(LocalDate.now())
                .status(EmployeeStatus.ACTIVE)
                .user(user)
                .build();
        employeeRepository.save(employee);

        auditLogService.log(request.getEmail(), "REGISTER", "User", user.getId().toString(),
                "New employee account self-registered");

        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .email(user.getEmail())
                .role(user.getRole().name())
                .fullName(employee.getFullName())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        String fullName = user.getEmployee() != null ? user.getEmployee().getFullName() : user.getEmail();

        auditLogService.log(request.getEmail(), "LOGIN", "User", user.getId().toString(), "User logged in");

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .email(user.getEmail())
                .role(user.getRole().name())
                .fullName(fullName)
                .build();
    }

    @Override
    public AuthResponse refresh(String refreshToken) {
        String email = jwtUtil.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!jwtUtil.isTokenValid(refreshToken, user)) {
            throw new com.krishna.ems.exception.BadRequestException("Invalid or expired refresh token");
        }

        String newAccessToken = jwtUtil.generateAccessToken(user);
        String newRefreshToken = jwtUtil.generateRefreshToken(user);
        String fullName = user.getEmployee() != null ? user.getEmployee().getFullName() : user.getEmail();

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .email(user.getEmail())
                .role(user.getRole().name())
                .fullName(fullName)
                .build();
    }
}
