package com.example.kopring.facility.controller

import com.example.kopring.facility.entity.FacilityEntities
import com.example.kopring.facility.service.FacilityService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class FacilityController(private val facilityService: FacilityService) {

    @GetMapping("/facility")
    fun facilityList(): List<FacilityEntities>{
        return facilityService.getAllFacilities()
    }
}
