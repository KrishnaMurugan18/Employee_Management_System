package com.krishna.ems.service.impl;

import com.krishna.ems.dto.response.DashboardStatsResponse;
import com.krishna.ems.entity.AuditLog;
import com.krishna.ems.entity.Department;
import com.krishna.ems.entity.EmployeeStatus;
import com.krishna.ems.repository.AuditLogRepository;
import com.krishna.ems.repository.DepartmentRepository;
import com.krishna.ems.repository.EmployeeRepository;
import com.krishna.ems.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AuditLogRepository auditLogRepository;

    private static final DateTimeFormatter MONTH_FMT = DateTimeFormatter.ofPattern("yyyy-MM");
    private static final DateTimeFormatter DISPLAY_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        long total = employeeRepository.count();
        long active = employeeRepository.countByStatus(EmployeeStatus.ACTIVE);
        long inactive = employeeRepository.countByStatus(EmployeeStatus.INACTIVE);
        long deptCount = departmentRepository.count();

        Map<String, Long> distribution = new LinkedHashMap<>();
        for (Department dept : departmentRepository.findAll()) {
            distribution.put(dept.getName(), (long) dept.getEmployees().size());
        }

        List<DashboardStatsResponse.MonthlyGrowthPoint> growth = computeGrowthLast6Months();

        List<DashboardStatsResponse.RecentActivity> recent = auditLogRepository
                .findAllByOrderByPerformedAtDesc(PageRequest.of(0, 8))
                .stream()
                .map(this::toActivity)
                .toList();

        return DashboardStatsResponse.builder()
                .totalEmployees(total)
                .activeEmployees(active)
                .inactiveEmployees(inactive)
                .totalDepartments(deptCount)
                .departmentDistribution(distribution)
                .employeeGrowth(growth)
                .recentActivities(recent)
                .build();
    }

    private List<DashboardStatsResponse.MonthlyGrowthPoint> computeGrowthLast6Months() {
        return java.util.stream.IntStream.rangeClosed(0, 5)
                .mapToObj(i -> LocalDate.now().minusMonths(5 - i))
                .map(date -> {
                    LocalDate start = date.withDayOfMonth(1);
                    LocalDate end = start.plusMonths(1).minusDays(1);
                    long count = employeeRepository.countByJoiningDateBetween(start, end);
                    return DashboardStatsResponse.MonthlyGrowthPoint.builder()
                            .month(start.format(MONTH_FMT))
                            .count(count)
                            .build();
                })
                .toList();
    }

    private DashboardStatsResponse.RecentActivity toActivity(AuditLog log) {
        return DashboardStatsResponse.RecentActivity.builder()
                .action(log.getAction())
                .performedBy(log.getPerformedBy())
                .details(log.getDetails())
                .performedAt(log.getPerformedAt().format(DISPLAY_FMT))
                .build();
    }
}
