import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import BookACabPage from '../pages/BookACab/BookACabPage';
import PaymentCheckoutPage from '../pages/PaymentCheckout/PaymentCheckoutPage';
import LiveTrackingPage from '../pages/LiveTracking/LiveTrackingPage';
import PassengerHubPage from '../pages/PassengerHub/PassengerHubPage';
import MyBookingsPage from '../pages/MyBookings/MyBookingsPage';
import DriverDashboardPage from '../pages/DriverDashboard/DriverDashboardPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/book-a-cab" element={<BookACabPage />} />
      <Route path="/checkout" element={<PaymentCheckoutPage />} />
      <Route path="/tracking" element={<LiveTrackingPage />} />
      <Route path="/tracking/:bookingRef" element={<LiveTrackingPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/hub"
        element={
          <ProtectedRoute>
            <PassengerHubPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver"
        element={
          <ProtectedRoute requireDriver={true}>
            <DriverDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}