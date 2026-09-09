package com.cabgo.service;

import com.cabgo.dto.request.PaymentCreateRequest;
import com.cabgo.dto.response.PaymentResponse;

public interface PaymentService {
    PaymentResponse processPayment(PaymentCreateRequest request);
    PaymentResponse getPaymentByBookingId(Long bookingId);
}
