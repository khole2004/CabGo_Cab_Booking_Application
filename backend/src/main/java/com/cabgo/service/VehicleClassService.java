package com.cabgo.service;

import com.cabgo.dto.response.VehicleClassResponse;
import java.util.List;

public interface VehicleClassService {
    List<VehicleClassResponse> getAllActiveClasses();
    VehicleClassResponse getByCode(String code);
}
