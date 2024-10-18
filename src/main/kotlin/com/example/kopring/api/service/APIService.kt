package com.example.kopring.api.service

import com.example.kopring.board.service.PostService
import com.example.kopring.facility.entity.FacilityEntities
import com.example.kopring.facility.service.FacilityService
import com.example.kopring.user.dto.UserInfoDto
import com.example.kopring.user.service.UserService
import org.springframework.stereotype.Service

@Service
class APIService(
    private val userService: UserService,
    private val postService: PostService,
    private val facilityService: FacilityService
) {

    fun checkId(id: String): String{
        println("check id: $id")
        println("result: ${userService.idMatch(id)}")
        return userService.idMatch(id)
    }
    fun getUserInfo(id: String): UserInfoDto?{
        return userService.getUserInfo(id)

    }
    fun getReplyMaxId(): Int?{
        return postService.getReplyMaxId()
    }

    fun getNearFacility(y_cor: Double, x_cor: Double): List<FacilityEntities>{
        println(y_cor)
        return facilityService.get_near_Facility(y_cor, x_cor)
    }
}