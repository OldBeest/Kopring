package com.example.kopring.facility.repository

import com.example.kopring.facility.entity.FavoriteEntities
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface FavoriteRepository: JpaRepository<FavoriteEntities, String> {

    fun save(favoriteEntities: FavoriteEntities) : Unit

    fun deleteByFacilityAddress(facilityAddress: String) : Unit
}