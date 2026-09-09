-- ==========================================================
-- CabGo Platform - Initial Database Schema Migration (MSSQL)
-- Version: V1__init_schema.sql
-- ==========================================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(120) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        full_name NVARCHAR(120) NOT NULL,
        phone_number NVARCHAR(25),
        role NVARCHAR(30) NOT NULL DEFAULT 'ROLE_PASSENGER',
        avatar_url NVARCHAR(500),
        wallet_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
        is_active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'drivers')
BEGIN
    CREATE TABLE drivers (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NOT NULL UNIQUE,
        license_number NVARCHAR(50),
        vehicle_model NVARCHAR(100) NOT NULL,
        vehicle_plate_number NVARCHAR(30) NOT NULL,
        vehicle_class_code NVARCHAR(30) NOT NULL,
        is_online BIT NOT NULL DEFAULT 0,
        current_status NVARCHAR(30) NOT NULL DEFAULT 'IDLE',
        current_latitude DECIMAL(9,6),
        current_longitude DECIMAL(9,6),
        today_earnings DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        completed_trips_today INT NOT NULL DEFAULT 0,
        acceptance_rate DECIMAL(5,2) NOT NULL DEFAULT 96.00,
        rating DECIMAL(3,2) NOT NULL DEFAULT 4.95,
        total_rides INT NOT NULL DEFAULT 0,
        created_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_drivers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'vehicle_classes')
BEGIN
    CREATE TABLE vehicle_classes (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        code NVARCHAR(30) NOT NULL UNIQUE,
        name NVARCHAR(60) NOT NULL,
        description NVARCHAR(255),
        capacity INT NOT NULL DEFAULT 4,
        base_fare DECIMAL(10,2) NOT NULL,
        per_km_rate DECIMAL(10,2) NOT NULL,
        eta_minutes INT NOT NULL DEFAULT 3,
        icon_name NVARCHAR(50) NOT NULL DEFAULT 'directions_car',
        is_popular BIT NOT NULL DEFAULT 0,
        is_active BIT NOT NULL DEFAULT 1
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'bookings')
BEGIN
    CREATE TABLE bookings (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        booking_reference NVARCHAR(30) NOT NULL UNIQUE,
        passenger_id BIGINT NOT NULL,
        driver_id BIGINT NULL,
        vehicle_class_code NVARCHAR(30) NOT NULL,
        trip_type NVARCHAR(30) NOT NULL DEFAULT 'CITY',
        pickup_address NVARCHAR(255) NOT NULL,
        pickup_lat DECIMAL(9,6) NULL,
        pickup_lng DECIMAL(9,6) NULL,
        dropoff_address NVARCHAR(255) NOT NULL,
        dropoff_lat DECIMAL(9,6) NULL,
        dropoff_lng DECIMAL(9,6) NULL,
        distance_km DECIMAL(6,2) NOT NULL DEFAULT 0.00,
        duration_minutes INT NOT NULL DEFAULT 0,
        base_fare DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        distance_fare DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        platform_fee DECIMAL(10,2) NOT NULL DEFAULT 15.00,
        tax_fare DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        discount_fare DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        carbon_offset_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        total_fare DECIMAL(10,2) NOT NULL,
        payment_method NVARCHAR(50) NOT NULL DEFAULT 'UPI',
        payment_status NVARCHAR(30) NOT NULL DEFAULT 'PENDING',
        status NVARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
        otp_code NVARCHAR(6) NOT NULL,
        scheduled_time DATETIME2 NULL,
        start_time DATETIME2 NULL,
        end_time DATETIME2 NULL,
        cancellation_reason NVARCHAR(255) NULL,
        created_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_bookings_passenger FOREIGN KEY (passenger_id) REFERENCES users(id),
        CONSTRAINT fk_bookings_driver FOREIGN KEY (driver_id) REFERENCES drivers(id)
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'payments')
BEGIN
    CREATE TABLE payments (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        booking_id BIGINT NOT NULL,
        transaction_reference NVARCHAR(60) NOT NULL UNIQUE,
        payment_method NVARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status NVARCHAR(30) NOT NULL DEFAULT 'PENDING',
        provider_response NVARCHAR(500) NULL,
        created_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'saved_locations')
BEGIN
    CREATE TABLE saved_locations (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NOT NULL,
        title NVARCHAR(50) NOT NULL,
        address NVARCHAR(255) NOT NULL,
        icon NVARCHAR(50) NOT NULL DEFAULT 'bookmark',
        latitude DECIMAL(9,6) NULL,
        longitude DECIMAL(9,6) NULL,
        created_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_saved_locations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'promo_coupons')
BEGIN
    CREATE TABLE promo_coupons (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        code NVARCHAR(30) NOT NULL UNIQUE,
        description NVARCHAR(255) NOT NULL,
        discount_type NVARCHAR(20) NOT NULL DEFAULT 'PERCENTAGE',
        discount_value DECIMAL(10,2) NOT NULL,
        min_ride_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        max_discount DECIMAL(10,2) NULL,
        is_active BIT NOT NULL DEFAULT 1,
        valid_until DATETIME2 NULL,
        created_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'reviews')
BEGIN
    CREATE TABLE reviews (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        booking_id BIGINT NOT NULL,
        passenger_id BIGINT NOT NULL,
        driver_id BIGINT NULL,
        rating_stars INT NOT NULL CHECK (rating_stars BETWEEN 1 AND 5),
        feedback_comment NVARCHAR(500) NULL,
        created_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        CONSTRAINT fk_reviews_passenger FOREIGN KEY (passenger_id) REFERENCES users(id),
        CONSTRAINT fk_reviews_driver FOREIGN KEY (driver_id) REFERENCES drivers(id)
    );
END;
