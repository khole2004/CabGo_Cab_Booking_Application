-- ==========================================================
-- CabGo Platform - Initial Seed Data Migration (MSSQL)
-- Version: V2__seed_data.sql
-- ==========================================================

-- 1. Insert Vehicle Classes
INSERT INTO vehicle_classes (code, name, description, capacity, base_fare, per_km_rate, eta_minutes, icon_name, is_popular, is_active)
VALUES
('MINI', 'CabGo Mini', 'Maruti Swift / WagonR - Compact & Economical', 4, 50.00, 12.00, 3, 'directions_car', 0, 1),
('SEDAN', 'CabGo Sedan Prime', 'Honda City / Hyundai Verna - AC & Spacious', 4, 80.00, 15.00, 4, 'airport_shuttle', 1, 1),
('SUV', 'CabGo SUV', 'Toyota Innova / Ertiga - Spacious 6 Seater', 6, 120.00, 20.00, 6, 'rv_hookup', 0, 1),
('EV', 'CabGo EV Prime', 'Tata Nexon EV / ZS EV - 100% Eco-Friendly Electric', 4, 90.00, 16.00, 5, 'electric_car', 0, 1);

-- 2. Insert Users (BCrypt hashes for 'CityRider@2025!', 'Driver@2025!', 'Admin@2025!')
-- CityRider@2025! -> $2a$10$0k6.RiqP1qBw6M/7yWJ7E.rF6WfX0c6a8MvT8pYjR7b2j4sYnQ8xK
INSERT INTO users (email, password, full_name, phone_number, role, avatar_url, wallet_balance, rating, is_active)
VALUES
('ananya@example.com', '$2a$10$Vq6kM.O81PvZ2ZJ4Yh9wue1y7b2y1W3c6a8MvT8pYjR7b2j4sYnQ.', 'Ananya Sharma', '+91 98765 43210', 'ROLE_PASSENGER', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwFqZF72JxhjJ08j7W6V6Pc3TPexzy3AmvJg2rKzayewadm7MrF_V1wR0ui5d1WmLCFoNmGHKxRP-3mgxqh0T0Es_Gpuig3up84ccVIITHmU_RiSvf6kNETZSrPuUGKPKpyhF6cUV1wkDHtUX1ibuPngoXRZB48Svha7EarUeNxvj-PHOWOj7h__4CdiJIh-vExE4SK0qno0SOSFWgUyMJAHn24nYcXjXTTVmpFnkdNO41eGQJpv_d', 1250.00, 4.98, 1),
('rajesh.driver@example.com', '$2a$10$Vq6kM.O81PvZ2ZJ4Yh9wue1y7b2y1W3c6a8MvT8pYjR7b2j4sYnQ.', 'Rajesh Kumar', '+91 98111 22334', 'ROLE_DRIVER', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkRLrnOA94H1rMrS1b4Tv-P4ABypzcBXoDlVRBpmV4qYnqgMw8-bLRd74OOCXNl_LGl4oKphXvw7vi7HTSazwE5a7SS1yae6yMJUDLtihiE-CCwX--Gy0qO2VhqI9YcEAZzUDp_B-W8hNpYRRJCWQPQnCgEatYQ3Dz0vZfZiY3vD35NR_K9r9S7T4_Drp6TqSex__tg-H16mCDwtL0NMlSNXtUlKSbWVN3ktfcm5xbVLRm9LilUgZu', 4500.00, 4.96, 1),
('admin@cabgo.com', '$2a$10$Vq6kM.O81PvZ2ZJ4Yh9wue1y7b2y1W3c6a8MvT8pYjR7b2j4sYnQ.', 'CabGo Administrator', '+91 99999 00000', 'ROLE_ADMIN', 'https://lh3.googleusercontent.com/aida/AEtjO1UIIT3kRPL1eydxbJPQRUooLDd5EC107tizhB8e4Gsr16tAIULPFFscWPmNTKKrBgnpI7rKrasyVICyfq-1Ee9ffbFiLalwFdtGsuOAIs3OlpKSgT4Y62jrtNW7Zob05alA2skRkOSG3wuaYrpheo8E-4nTcIU0swXopDie8E9duJvwPCeaN30qbitYyjVZEZEuWpPw_ojQEg_RSr0eJlqIxHoZ7tazR6QRNdLdmY3KO4WOpUE0Ea12cn4', 0.00, 5.00, 1);

-- 3. Insert Driver Partner for Rajesh Kumar
DECLARE @DriverUserId BIGINT = (SELECT id FROM users WHERE email = 'rajesh.driver@example.com');

INSERT INTO drivers (user_id, license_number, vehicle_model, vehicle_plate_number, vehicle_class_code, is_online, current_status, current_latitude, current_longitude, today_earnings, completed_trips_today, acceptance_rate, rating, total_rides)
VALUES
(@DriverUserId, 'DL-0420190012', 'Honda City / Hyundai Verna', 'DL 01 AX 4892', 'SEDAN', 1, 'ON_TRIP', 28.5562, 77.1000, 2480.00, 8, 96.20, 4.96, 1840);

-- 4. Insert Promo Coupons
INSERT INTO promo_coupons (code, description, discount_type, discount_value, min_ride_amount, max_discount, is_active)
VALUES
('FIRST50', '50% off on your first CabGo ride', 'PERCENTAGE', 50.00, 100.00, 100.00, 1),
('CABGO100', 'Flat ₹100 off on outstation or airport bookings', 'FLAT', 100.00, 300.00, 100.00, 1),
('CITY20', '20% off on regular city commutes', 'PERCENTAGE', 20.00, 150.00, 50.00, 1);

-- 5. Insert Saved Locations for Passenger Ananya
DECLARE @PassengerUserId BIGINT = (SELECT id FROM users WHERE email = 'ananya@example.com');

INSERT INTO saved_locations (user_id, title, address, icon, latitude, longitude)
VALUES
(@PassengerUserId, 'Home', 'A-42 Green Park Main, South Delhi, New Delhi', 'home', 28.5583, 77.2023),
(@PassengerUserId, 'Work', 'DLF Cyber City, Tower B, Sector 25, Gurugram', 'business', 28.4907, 77.0898),
(@PassengerUserId, 'Airport', 'Terminal 3, Indira Gandhi International Airport', 'flight', 28.5562, 77.1000);

-- 6. Insert Sample Active Booking (#CG-849201 matching Stitch Live Tracking & Checkout)
DECLARE @DriverId BIGINT = (SELECT id FROM drivers WHERE user_id = @DriverUserId);

INSERT INTO bookings (
    booking_reference, passenger_id, driver_id, vehicle_class_code, trip_type,
    pickup_address, dropoff_address, distance_km, duration_minutes,
    base_fare, distance_fare, platform_fee, tax_fare, discount_fare, carbon_offset_fee, total_fare,
    payment_method, payment_status, status, otp_code
)
VALUES
('CG-849201', @PassengerUserId, @DriverId, 'SEDAN', 'CITY',
 'Terminal 3, IGI Airport (Commercial Pillar 14)',
 'DLF Cyber Hub, Sector 24, Gurugram',
 14.8, 28, 80.00, 222.00, 15.00, 18.00, 50.00, 2.00, 365.00,
 'UPI', 'PAID', 'DRIVER_ARRIVING', '4892');

INSERT INTO payments (booking_id, transaction_reference, payment_method, amount, status)
VALUES
((SELECT id FROM bookings WHERE booking_reference = 'CG-849201'), 'TXN-9482014892', 'Google Pay UPI', 365.00, 'SUCCESS');

-- 7. Insert Prior Completed Booking for Trip History
INSERT INTO bookings (
    booking_reference, passenger_id, driver_id, vehicle_class_code, trip_type,
    pickup_address, dropoff_address, distance_km, duration_minutes,
    base_fare, distance_fare, platform_fee, tax_fare, discount_fare, carbon_offset_fee, total_fare,
    payment_method, payment_status, status, otp_code
)
VALUES
('CG-739104', @PassengerUserId, @DriverId, 'SEDAN', 'CITY',
 'DLF Cyber City Tower B', 'Select Citywalk Mall, Saket',
 18.2, 35, 80.00, 273.00, 15.00, 22.00, 0.00, 0.00, 390.00,
 'CARD', 'PAID', 'COMPLETED', '3190');

INSERT INTO reviews (booking_id, passenger_id, driver_id, rating_stars, feedback_comment)
VALUES
((SELECT id FROM bookings WHERE booking_reference = 'CG-739104'), @PassengerUserId, @DriverId, 5, 'Very polite captain, clean air-conditioned sedan and smooth navigation.');
