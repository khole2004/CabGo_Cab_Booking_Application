package com.cabgo.service.impl;

import com.cabgo.dto.request.PaymentCreateRequest;
import com.cabgo.dto.response.PaymentResponse;
import com.cabgo.entity.Booking;
import com.cabgo.entity.Payment;
import com.cabgo.exception.ResourceNotFoundException;
import com.cabgo.mapper.EntityDtoMapper;
import com.cabgo.repository.BookingRepository;
import com.cabgo.repository.PaymentRepository;
import com.cabgo.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final EntityDtoMapper mapper;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              BookingRepository bookingRepository,
                              EntityDtoMapper mapper) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public PaymentResponse processPayment(PaymentCreateRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));

        String txnRef = request.getTransactionReference() != null ?
                request.getTransactionReference() : "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setTransactionReference(txnRef);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(request.getAmount());
        payment.setStatus("SUCCESS");
        payment.setProviderResponse("256-Bit Encrypted Payment Verified");

        payment = paymentRepository.save(payment);

        booking.setPaymentStatus("PAID");
        booking.setPaymentMethod(request.getPaymentMethod());
        bookingRepository.save(booking);

        return mapper.toPaymentResponse(payment);
    }

    @Override
    public PaymentResponse getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking id: " + bookingId));
        return mapper.toPaymentResponse(payment);
    }
}
