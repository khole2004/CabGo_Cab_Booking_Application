package com.cabgo.repository;

import com.cabgo.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDriverId(Long driverId);
    List<Review> findByPassengerId(Long passengerId);
}
