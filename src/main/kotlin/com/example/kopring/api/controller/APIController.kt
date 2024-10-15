package com.example.kopring.api.controller

import com.example.kopring.api.service.APIService
import com.example.kopring.user.dto.UserInfoDto
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

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
    @GetMapping("user-info")
    fun userInfo(@RequestParam("userName") userName: String): UserInfoDto? {
        return apiService.getUserInfo(userName)
    }
}