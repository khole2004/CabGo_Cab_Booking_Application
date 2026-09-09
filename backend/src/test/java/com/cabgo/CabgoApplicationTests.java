package com.cabgo;

import com.cabgo.dto.request.LoginRequest;
import com.cabgo.dto.request.RegisterRequest;
import com.cabgo.dto.response.AuthResponse;
import com.cabgo.dto.response.VehicleClassResponse;
import com.cabgo.service.AuthService;
import com.cabgo.service.VehicleClassService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("h2")
class CabgoApplicationTests {

    @Autowired
    private VehicleClassService vehicleClassService;

    @Autowired
    private AuthService authService;

    @Test
    void contextLoads() {
        assertNotNull(vehicleClassService);
        assertNotNull(authService);
    }

    @Test
    void testVehicleClassesLoaded() {
        List<VehicleClassResponse> classes = vehicleClassService.getAllActiveClasses();
        assertNotNull(classes);
        assertFalse(classes.isEmpty(), "Vehicle classes should be pre-seeded");
        assertTrue(classes.stream().anyMatch(v -> "SEDAN".equals(v.getCode())));
    }

    @Test
    void testPassengerLogin() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("ananya@example.com");
        request.setPassword("CityRider@2025!");

        AuthResponse response = authService.login(request);
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("Ananya Sharma", response.getUser().getFullName());
    }

    @Test
    void testRegisterNewPassenger() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Karan Verma");
        request.setEmail("karan.test@example.com");
        request.setPhoneNumber("+91 99887 76655");
        request.setPassword("SecurePass@2025");
        request.setRole("ROLE_PASSENGER");

        AuthResponse response = authService.register(request);
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("Karan Verma", response.getUser().getFullName());
    }
}