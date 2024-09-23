package com.example.kopring.facility.repository

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface FacilityRepository: CrudRepository<FacilityEntities, String> {
    override fun findAll(): List<FacilityEntities>
    fun findByAdstatus(ad_Status: Int): List<FacilityEntities>
}