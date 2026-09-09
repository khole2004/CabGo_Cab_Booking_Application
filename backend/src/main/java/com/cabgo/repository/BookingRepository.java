package com.cabgo.repository;

import com.cabgo.entity.Booking;
import com.cabgo.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByPassengerIdOrderByCreatedAtDesc(Long passengerId);
    List<Booking> findByDriverIdOrderByCreatedAtDesc(Long driverId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByPassengerIdAndStatus(Long passengerId, BookingStatus status);
    long countByPassengerIdAndStatus(Long passengerId, BookingStatus status);
}
