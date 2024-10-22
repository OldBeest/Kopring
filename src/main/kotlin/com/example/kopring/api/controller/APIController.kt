package com.example.kopring.api.controller

import com.example.kopring.api.service.APIService
import com.example.kopring.facility.entity.FacilityEntities
import com.example.kopring.user.dto.UserInfoDto
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Tag(name = "API Controller", description = "유저 정보, 즐겨찾기 API")
@RequestMapping("/api")
@RestController
class APIController(private val apiService: APIService) {

    @GetMapping("/health")
    fun healthTest(): String {
        return "hello world kotlin!"
    }

    @GetMapping("/facility")
    fun facilityTest(): String {
        return "facility list"
    }


    @GetMapping("/check_id")
    fun checkId(@RequestParam("id") id: String): String{
        return apiService.checkId(id)
    }

    //아이디로 유저 정보 받아오기
    @GetMapping("/user_info")
    fun userInfo(@RequestParam("userName") userName: String): UserInfoDto? {
        return apiService.getUserInfo(userName)
    }

    @GetMapping("/reply_id_max")
    fun getReplyMaxId(): Int?{
        return apiService.getReplyMaxId()
    }

    @GetMapping("/near_facility")
    fun getNearFacility(@RequestParam("y_cor") y_cor: Double, @RequestParam("x_cor") x_cor: Double): List<FacilityEntities>{
        return apiService.getNearFacility(y_cor, x_cor)
    }

    @GetMapping("/favorite")
    fun getFavoriteFacility(@RequestParam("user_id") user_id: String): List<FacilityEntities>{
        return apiService.getFavoriteFacility(user_id)
    }

    @PostMapping("/favorite")
    fun addFavoriteFacility(@RequestParam("user_id") userId: String, @RequestParam("facility_address") address: String):Unit{
        println(userId)
        println(address)
        return apiService.addFavoriteFacility(userId, address)
    }

    @DeleteMapping("/favorite")
    fun deleteFavoriteFacility(@RequestParam("facility_address") address: String):Unit{
        return apiService.deleteFavoriteFacility(address)
    }
}