package com.krishna.ems.repository;

import com.krishna.ems.entity.Employee;
import com.krishna.ems.entity.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

    Optional<Employee> findByEmail(String email);

    Optional<Employee> findByEmployeeCode(String employeeCode);

    Optional<Employee> findByUser_Id(Long userId);

    boolean existsByEmail(String email);

    long countByStatus(EmployeeStatus status);

    List<Employee> findTop5ByOrderByCreatedAtDesc();

    long countByJoiningDateBetween(LocalDate start, LocalDate end);
}
