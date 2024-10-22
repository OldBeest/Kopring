package com.example.kopring.facility.service

import com.example.kopring.facility.entity.FacilityEntities
import com.example.kopring.facility.entity.FavoriteEntities
import com.example.kopring.facility.repository.FacilityRepository
import com.example.kopring.facility.repository.FavoriteRepository
import com.example.kopring.user.repository.UserRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class FacilityService(private val facilityRepository : FacilityRepository,
                      private val favoriteRepository: FavoriteRepository) {

    fun getAllFacilities() : List<FacilityEntities> = facilityRepository.findAll()
    fun get_AD_Facility(): List<FacilityEntities> = facilityRepository.findByAdstatus(1)
    fun get_near_Facility(y_cor: Double, x_cor: Double): List<FacilityEntities> = facilityRepository.sortNearFacility(y_cor, x_cor)

    fun getFavoriteFacility(user_id: String): List<FacilityEntities> = facilityRepository.getFavoriteFacility(user_id)
    fun addFavoriteFacility(user_id: String, facility_address: String){
        val entities: FavoriteEntities = FavoriteEntities(user_id, facility_address)
        favoriteRepository.save(entities)
    }
    @Transactional
    fun deleteFavoriteFacility(facility_address: String) = favoriteRepository.deleteByFacilityAddress(facility_address)
}