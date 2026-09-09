package com.cabgo.repository;

import com.cabgo.entity.VehicleClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleClassRepository extends JpaRepository<VehicleClass, Long> {
    Optional<VehicleClass> findByCode(String code);
    List<VehicleClass> findByIsActiveTrue();
}
