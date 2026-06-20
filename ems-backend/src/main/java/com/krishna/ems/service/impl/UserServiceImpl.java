package com.krishna.ems.service.impl;

import com.krishna.ems.dto.request.ChangePasswordRequest;
import com.krishna.ems.entity.User;
import com.krishna.ems.exception.BadRequestException;
import com.krishna.ems.exception.ResourceNotFoundException;
import com.krishna.ems.repository.UserRepository;
import com.krishna.ems.service.AuditLogService;
import com.krishna.ems.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        auditLogService.log(email, "CHANGE_PASSWORD", "User", user.getId().toString(), "Password changed");
    }
}
