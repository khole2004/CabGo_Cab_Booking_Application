package com.cabgo.repository;

import com.cabgo.entity.PromoCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromoCouponRepository extends JpaRepository<PromoCoupon, Long> {
    Optional<PromoCoupon> findByCodeIgnoreCaseAndIsActiveTrue(String code);
}
