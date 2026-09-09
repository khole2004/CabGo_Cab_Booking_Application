package com.cabgo.controller;

import com.cabgo.dto.response.ApiResponse;
import com.cabgo.dto.response.VehicleClassResponse;
import com.cabgo.service.VehicleClassService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleClassController {

    private final VehicleClassService vehicleClassService;

    public VehicleClassController(VehicleClassService vehicleClassService) {
        this.vehicleClassService = vehicleClassService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleClassResponse>>> getAllVehicleClasses() {
        List<VehicleClassResponse> classes = vehicleClassService.getAllActiveClasses();
        return ResponseEntity.ok(ApiResponse.ok(classes));
    }

    @GetMapping("/{code}")
    public ResponseEntity<ApiResponse<VehicleClassResponse>> getByCode(@PathVariable String code) {
        VehicleClassResponse response = vehicleClassService.getByCode(code);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
