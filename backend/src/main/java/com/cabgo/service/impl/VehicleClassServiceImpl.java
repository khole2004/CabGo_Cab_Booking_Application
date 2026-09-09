package com.cabgo.service.impl;

import com.cabgo.dto.response.VehicleClassResponse;
import com.cabgo.entity.VehicleClass;
import com.cabgo.exception.ResourceNotFoundException;
import com.cabgo.mapper.EntityDtoMapper;
import com.cabgo.repository.VehicleClassRepository;
import com.cabgo.service.VehicleClassService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleClassServiceImpl implements VehicleClassService {

    private final VehicleClassRepository repository;
    private final EntityDtoMapper mapper;

    public VehicleClassServiceImpl(VehicleClassRepository repository, EntityDtoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<VehicleClassResponse> getAllActiveClasses() {
        return repository.findByIsActiveTrue().stream()
                .map(mapper::toVehicleClassResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleClassResponse getByCode(String code) {
        VehicleClass vc = repository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle class not found with code: " + code));
        return mapper.toVehicleClassResponse(vc);
    }
}
