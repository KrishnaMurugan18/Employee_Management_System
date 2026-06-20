package com.krishna.ems.config;

import com.krishna.ems.entity.*;
import com.krishna.ems.repository.DepartmentRepository;
import com.krishna.ems.repository.EmployeeRepository;
import com.krishna.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Seeds a default admin account and a small set of sample data so the app
 * is immediately demoable after a fresh deploy. Idempotent — safe to run on every startup.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email}")
    private String adminEmail;

    @Value("${app.admin.default-password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedDepartments();
        seedSampleEmployees();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }
        User admin = User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .enabled(true)
                .build();
        userRepository.save(admin);
        log.info("Seeded default admin account: {}", adminEmail);
    }

    private void seedDepartments() {
        if (departmentRepository.count() > 0) {
            return;
        }
        List<Department> departments = List.of(
                Department.builder().name("Engineering").description("Software development and platform engineering").build(),
                Department.builder().name("Human Resources").description("Recruitment, onboarding and employee relations").build(),
                Department.builder().name("Sales").description("Revenue generation and client acquisition").build(),
                Department.builder().name("Marketing").description("Brand, growth and product marketing").build(),
                Department.builder().name("Finance").description("Accounting, payroll and financial planning").build()
        );
        departmentRepository.saveAll(departments);
        log.info("Seeded {} departments", departments.size());
    }

    private void seedSampleEmployees() {
        if (employeeRepository.count() > 0) {
            return;
        }
        Department engineering = departmentRepository.findByNameIgnoreCase("Engineering").orElseThrow();
        Department hr = departmentRepository.findByNameIgnoreCase("Human Resources").orElseThrow();
        Department sales = departmentRepository.findByNameIgnoreCase("Sales").orElseThrow();
        Department marketing = departmentRepository.findByNameIgnoreCase("Marketing").orElseThrow();
        Department finance = departmentRepository.findByNameIgnoreCase("Finance").orElseThrow();

        List<Employee> sample = List.of(
                emp("EMP-00001", "Aarav", "Sharma", "aarav.sharma@ems.com", engineering, "Backend Developer", "92000", LocalDate.of(2023, 3, 14)),
                emp("EMP-00002", "Diya", "Patel", "diya.patel@ems.com", engineering, "Frontend Developer", "88000", LocalDate.of(2023, 6, 1)),
                emp("EMP-00003", "Vihaan", "Reddy", "vihaan.reddy@ems.com", engineering, "DevOps Engineer", "98000", LocalDate.of(2024, 1, 10)),
                emp("EMP-00004", "Ananya", "Iyer", "ananya.iyer@ems.com", hr, "HR Manager", "75000", LocalDate.of(2022, 11, 20)),
                emp("EMP-00005", "Kabir", "Nair", "kabir.nair@ems.com", sales, "Sales Executive", "65000", LocalDate.of(2024, 4, 5)),
                emp("EMP-00006", "Ishaan", "Gupta", "ishaan.gupta@ems.com", marketing, "Marketing Specialist", "70000", LocalDate.of(2023, 9, 18)),
                emp("EMP-00007", "Saanvi", "Joshi", "saanvi.joshi@ems.com", finance, "Financial Analyst", "80000", LocalDate.of(2024, 2, 1)),
                emp("EMP-00008", "Arjun", "Mehta", "arjun.mehta@ems.com", engineering, "Engineering Manager", "125000", LocalDate.of(2021, 7, 12))
        );
        employeeRepository.saveAll(sample);
        log.info("Seeded {} sample employees", sample.size());
    }

    private Employee emp(String code, String first, String last, String email, Department dept,
                          String designation, String salary, LocalDate joiningDate) {
        return Employee.builder()
                .employeeCode(code)
                .firstName(first)
                .lastName(last)
                .email(email)
                .phoneNumber("+91-90000-0" + code.substring(code.length() - 4))
                .department(dept)
                .designation(designation)
                .salary(new BigDecimal(salary))
                .joiningDate(joiningDate)
                .status(EmployeeStatus.ACTIVE)
                .build();
    }
}
