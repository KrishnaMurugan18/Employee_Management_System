package com.krishna.ems.service.impl;

import com.krishna.ems.entity.AuditLog;
import com.krishna.ems.repository.AuditLogRepository;
import com.krishna.ems.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    @Async
    public void log(String performedBy, String action, String entityType, String entityId, String details) {
        AuditLog log = AuditLog.builder()
                .performedBy(performedBy)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .build();
        auditLogRepository.save(log);
    }
}
