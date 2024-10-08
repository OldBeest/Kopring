package com.example.kopring.facility.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface FacilityRepository: JpaRepository<FacilityEntities, String> {
    override fun findAll(): List<FacilityEntities>
    fun findByAdstatus(ad_Status: Int): List<FacilityEntities>

    @Query(value = "select u.*, pow(:ycor - y_cor, 2) + pow(:xcor - x_cor, 2) as distance from facilitydb u order by distance asc", nativeQuery = true)
    fun sortNearFacility(@Param("ycor") y_cor: Double, @Param("xcor")x_cor: Double): List<FacilityEntities>

}