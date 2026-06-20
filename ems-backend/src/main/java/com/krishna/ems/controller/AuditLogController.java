package com.krishna.ems.controller;

import com.krishna.ems.dto.response.ApiResponse;
import com.krishna.ems.entity.AuditLog;
import com.krishna.ems.repository.AuditLogRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/audit-logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Audit Logs", description = "System activity trail (Admin only)")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    @Operation(summary = "List recent audit log entries (Admin only)")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getRecent(@RequestParam(defaultValue = "50") int limit) {
        List<AuditLog> logs = auditLogRepository.findAllByOrderByPerformedAtDesc(PageRequest.of(0, limit));
        return ResponseEntity.ok(ApiResponse.success("Audit logs fetched", logs));
    }
}
