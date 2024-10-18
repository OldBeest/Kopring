package com.example.kopring.facility.service

import com.example.kopring.facility.entity.FacilityEntities
import com.example.kopring.facility.repository.FacilityRepository
import org.springframework.stereotype.Service

@Service
class FacilityService(private val facilityRepository : FacilityRepository) {

    fun getAllFacilities() : List<FacilityEntities> = facilityRepository.findAll()
    fun get_AD_Facility(): List<FacilityEntities> = facilityRepository.findByAdstatus(1)
    fun get_near_Facility(y_cor: Double, x_cor: Double): List<FacilityEntities> = facilityRepository.sortNearFacility(y_cor, x_cor)
}