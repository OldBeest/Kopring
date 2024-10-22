package com.example.kopring.facility.controller

import com.example.kopring.facility.entity.FacilityEntities
import com.example.kopring.facility.service.FacilityService
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@Tag(name = "Facility Controller", description = "시설 정보 API")
@RestController
class FacilityController(private val facilityService: FacilityService) {

    @GetMapping("/facility")
    fun facilityList(): List<FacilityEntities>{
        return facilityService.getAllFacilities()
    }
}
