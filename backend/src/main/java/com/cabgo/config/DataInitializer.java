package com.cabgo.config;

import com.cabgo.entity.*;
import com.cabgo.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final VehicleClassRepository vehicleClassRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final SavedLocationRepository savedLocationRepository;
    private final PromoCouponRepository promoCouponRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DriverRepository driverRepository,
                           VehicleClassRepository vehicleClassRepository,
                           BookingRepository bookingRepository,
                           PaymentRepository paymentRepository,
                           SavedLocationRepository savedLocationRepository,
                           PromoCouponRepository promoCouponRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.vehicleClassRepository = vehicleClassRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.savedLocationRepository = savedLocationRepository;
        this.promoCouponRepository = promoCouponRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Only seed if vehicle classes are not yet populated
        if (vehicleClassRepository.count() == 0) {
            log.info("Initializing default vehicle classes...");
            seedVehicleClasses();
        }

        if (userRepository.count() == 0) {
            log.info("Initializing default seed accounts and demo data...");
            seedUsersAndBookings();
        }
    }

    private void seedVehicleClasses() {
        VehicleClass mini = new VehicleClass();
        mini.setCode("MINI");
        mini.setName("CabGo Mini");
        mini.setDescription("Maruti Swift / WagonR - Compact & Economical");
        mini.setCapacity(4);
        mini.setBaseFare(new BigDecimal("50.00"));
        mini.setPerKmRate(new BigDecimal("12.00"));
        mini.setEtaMinutes(3);
        mini.setIconName("directions_car");
        mini.setIsPopular(false);
        mini.setIsActive(true);
        vehicleClassRepository.save(mini);

        VehicleClass sedan = new VehicleClass();
        sedan.setCode("SEDAN");
        sedan.setName("CabGo Sedan Prime");
        sedan.setDescription("Honda City / Hyundai Verna - AC & Spacious");
        sedan.setCapacity(4);
        sedan.setBaseFare(new BigDecimal("80.00"));
        sedan.setPerKmRate(new BigDecimal("15.00"));
        sedan.setEtaMinutes(4);
        sedan.setIconName("airport_shuttle");
        sedan.setIsPopular(true);
        sedan.setIsActive(true);
        vehicleClassRepository.save(sedan);

        VehicleClass suv = new VehicleClass();
        suv.setCode("SUV");
        suv.setName("CabGo SUV");
        suv.setDescription("Toyota Innova / Ertiga - Spacious 6 Seater");
        suv.setCapacity(6);
        suv.setBaseFare(new BigDecimal("120.00"));
        suv.setPerKmRate(new BigDecimal("20.00"));
        suv.setEtaMinutes(6);
        suv.setIconName("rv_hookup");
        suv.setIsPopular(false);
        suv.setIsActive(true);
        vehicleClassRepository.save(suv);

        VehicleClass ev = new VehicleClass();
        ev.setCode("EV");
        ev.setName("CabGo EV Prime");
        ev.setDescription("Tata Nexon EV / ZS EV - 100% Eco-Friendly Electric");
        ev.setCapacity(4);
        ev.setBaseFare(new BigDecimal("90.00"));
        ev.setPerKmRate(new BigDecimal("16.00"));
        ev.setEtaMinutes(5);
        ev.setIconName("electric_car");
        ev.setIsPopular(false);
        ev.setIsActive(true);
        vehicleClassRepository.save(ev);
    }

    private void seedUsersAndBookings() {
        String encodedPwd = passwordEncoder.encode("CityRider@2025!");

        // 1. Passenger Ananya
        User passenger = new User();
        passenger.setEmail("ananya@example.com");
        passenger.setPassword(encodedPwd);
        passenger.setFullName("Ananya Sharma");
        passenger.setPhoneNumber("+91 98765 43210");
        passenger.setRole(Role.ROLE_PASSENGER);
        passenger.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuDwFqZF72JxhjJ08j7W6V6Pc3TPexzy3AmvJg2rKzayewadm7MrF_V1wR0ui5d1WmLCFoNmGHKxRP-3mgxqh0T0Es_Gpuig3up84ccVIITHmU_RiSvf6kNETZSrPuUGKPKpyhF6cUV1wkDHtUX1ibuPngoXRZB48Svha7EarUeNxvj-PHOWOj7h__4CdiJIh-vExE4SK0qno0SOSFWgUyMJAHn24nYcXjXTTVmpFnkdNO41eGQJpv_d");
        passenger.setWalletBalance(new BigDecimal("1250.00"));
        passenger.setRating(new BigDecimal("4.98"));
        passenger = userRepository.save(passenger);

        // 2. Driver Partner Rajesh Kumar
        User driverUser = new User();
        driverUser.setEmail("rajesh.driver@example.com");
        driverUser.setPassword(encodedPwd);
        driverUser.setFullName("Rajesh Kumar");
        driverUser.setPhoneNumber("+91 98111 22334");
        driverUser.setRole(Role.ROLE_DRIVER);
        driverUser.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuAkRLrnOA94H1rMrS1b4Tv-P4ABypzcBXoDlVRBpmV4qYnqgMw8-bLRd74OOCXNl_LGl4oKphXvw7vi7HTSazwE5a7SS1yae6yMJUDLtihiE-CCwX--Gy0qO2VhqI9YcEAZzUDp_B-W8hNpYRRJCWQPQnCgEatYQ3Dz0vZfZiY3vD35NR_K9r9S7T4_Drp6TqSex__tg-H16mCDwtL0NMlSNXtUlKSbWVN3ktfcm5xbVLRm9LilUgZu");
        driverUser.setWalletBalance(new BigDecimal("4500.00"));
        driverUser.setRating(new BigDecimal("4.96"));
        driverUser = userRepository.save(driverUser);

        Driver driver = new Driver();
        driver.setUser(driverUser);
        driver.setLicenseNumber("DL-0420190012");
        driver.setVehicleModel("Honda City / Hyundai Verna");
        driver.setVehiclePlateNumber("DL 01 AX 4892");
        driver.setVehicleClassCode("SEDAN");
        driver.setIsOnline(true);
        driver.setCurrentStatus("ON_TRIP");
        driver.setCurrentLatitude(new BigDecimal("28.556200"));
        driver.setCurrentLongitude(new BigDecimal("77.100000"));
        driver.setTodayEarnings(new BigDecimal("2480.00"));
        driver.setCompletedTripsToday(8);
        driver.setAcceptanceRate(new BigDecimal("96.20"));
        driver.setRating(new BigDecimal("4.96"));
        driver.setTotalRides(1840);
        driver = driverRepository.save(driver);

        // 3. Admin User
        User admin = new User();
        admin.setEmail("admin@cabgo.com");
        admin.setPassword(encodedPwd);
        admin.setFullName("CabGo Administrator");
        admin.setPhoneNumber("+91 99999 00000");
        admin.setRole(Role.ROLE_ADMIN);
        admin.setAvatarUrl("https://lh3.googleusercontent.com/aida/AEtjO1UIIT3kRPL1eydxbJPQRUooLDd5EC107tizhB8e4Gsr16tAIULPFFscWPmNTKKrBgnpI7rKrasyVICyfq-1Ee9ffbFiLalwFdtGsuOAIs3OlpKSgT4Y62jrtNW7Zob05alA2skRkOSG3wuaYrpheo8E-4nTcIU0swXopDie8E9duJvwPCeaN30qbitYyjVZEZEuWpPw_ojQEg_RSr0eJlqIxHoZ7tazR6QRNdLdmY3KO4WOpUE0Ea12cn4");
        userRepository.save(admin);

        // 4. Promo Coupons
        PromoCoupon c1 = new PromoCoupon();
        c1.setCode("FIRST50");
        c1.setDescription("50% off on your first CabGo ride");
        c1.setDiscountType("PERCENTAGE");
        c1.setDiscountValue(new BigDecimal("50.00"));
        c1.setMinRideAmount(new BigDecimal("100.00"));
        c1.setMaxDiscount(new BigDecimal("100.00"));
        c1.setIsActive(true);
        promoCouponRepository.save(c1);

        PromoCoupon c2 = new PromoCoupon();
        c2.setCode("CABGO100");
        c2.setDescription("Flat ₹100 off on outstation or airport bookings");
        c2.setDiscountType("FLAT");
        c2.setDiscountValue(new BigDecimal("100.00"));
        c2.setMinRideAmount(new BigDecimal("300.00"));
        c2.setMaxDiscount(new BigDecimal("100.00"));
        c2.setIsActive(true);
        promoCouponRepository.save(c2);

        // 5. Saved Locations
        SavedLocation loc1 = new SavedLocation();
        loc1.setUser(passenger);
        loc1.setTitle("Home");
        loc1.setAddress("A-42 Green Park Main, South Delhi, New Delhi");
        loc1.setIcon("home");
        savedLocationRepository.save(loc1);

        SavedLocation loc2 = new SavedLocation();
        loc2.setUser(passenger);
        loc2.setTitle("Work");
        loc2.setAddress("DLF Cyber City, Tower B, Sector 25, Gurugram");
        loc2.setIcon("business");
        savedLocationRepository.save(loc2);

        SavedLocation loc3 = new SavedLocation();
        loc3.setUser(passenger);
        loc3.setTitle("Airport");
        loc3.setAddress("Terminal 3, Indira Gandhi International Airport");
        loc3.setIcon("flight");
        savedLocationRepository.save(loc3);

        // 6. Active Booking (#CG-849201 matching Stitch Live Tracking & Checkout)
        Booking active = new Booking();
        active.setBookingReference("CG-849201");
        active.setPassenger(passenger);
        active.setDriver(driver);
        active.setVehicleClassCode("SEDAN");
        active.setTripType("CITY");
        active.setPickupAddress("Terminal 3, IGI Airport (Commercial Pillar 14)");
        active.setDropoffAddress("DLF Cyber Hub, Sector 24, Gurugram");
        active.setDistanceKm(new BigDecimal("14.80"));
        active.setDurationMinutes(28);
        active.setBaseFare(new BigDecimal("80.00"));
        active.setDistanceFare(new BigDecimal("222.00"));
        active.setPlatformFee(new BigDecimal("15.00"));
        active.setTaxFare(new BigDecimal("18.00"));
        active.setDiscountFare(new BigDecimal("50.00"));
        active.setCarbonOffsetFee(new BigDecimal("2.00"));
        active.setTotalFare(new BigDecimal("365.00"));
        active.setPaymentMethod("Google Pay UPI");
        active.setPaymentStatus("PAID");
        active.setStatus(BookingStatus.DRIVER_ARRIVING);
        active.setOtpCode("4892");
        active = bookingRepository.save(active);

        Payment payment = new Payment();
        payment.setBooking(active);
        payment.setTransactionReference("TXN-9482014892");
        payment.setPaymentMethod("Google Pay UPI");
        payment.setAmount(new BigDecimal("365.00"));
        payment.setStatus("SUCCESS");
        payment.setProviderResponse("256-Bit Encrypted Payment Verified");
        paymentRepository.save(payment);

        // 7. Completed Booking
        Booking completed = new Booking();
        completed.setBookingReference("CG-739104");
        completed.setPassenger(passenger);
        completed.setDriver(driver);
        completed.setVehicleClassCode("SEDAN");
        completed.setTripType("CITY");
        completed.setPickupAddress("DLF Cyber City Tower B");
        completed.setDropoffAddress("Select Citywalk Mall, Saket");
        completed.setDistanceKm(new BigDecimal("18.20"));
        completed.setDurationMinutes(35);
        completed.setBaseFare(new BigDecimal("80.00"));
        completed.setDistanceFare(new BigDecimal("273.00"));
        completed.setPlatformFee(new BigDecimal("15.00"));
        completed.setTaxFare(new BigDecimal("22.00"));
        completed.setTotalFare(new BigDecimal("390.00"));
        completed.setPaymentMethod("VISA Card");
        completed.setPaymentStatus("PAID");
        completed.setStatus(BookingStatus.COMPLETED);
        completed.setOtpCode("3190");
        bookingRepository.save(completed);

        log.info("Seed data successfully initialized.");
    }
}