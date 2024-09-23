package com.example.kopring.facility.service

import com.example.kopring.facility.repository.FacilityEntities
import com.example.kopring.facility.repository.FacilityRepository
import org.springframework.stereotype.Service

@Service
class FacilityService(private val facilityRepository : FacilityRepository) {

    fun get_AD_Facility(): List<FacilityEntities> = facilityRepository.findByAdstatus(1)
}