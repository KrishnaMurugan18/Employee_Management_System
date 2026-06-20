package com.krishna.ems.service;

public interface AuditLogService {
    void log(String performedBy, String action, String entityType, String entityId, String details);
}
