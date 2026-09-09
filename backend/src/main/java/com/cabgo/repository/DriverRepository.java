package com.cabgo.repository;

import com.cabgo.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByUserId(Long userId);
    List<Driver> findByIsOnlineTrue();
    List<Driver> findByIsOnlineTrueAndCurrentStatus(String currentStatus);
    List<Driver> findByVehicleClassCodeAndIsOnlineTrue(String vehicleClassCode);
}
