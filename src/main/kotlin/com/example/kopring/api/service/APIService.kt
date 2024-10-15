package com.example.kopring.api.service

import com.example.kopring.user.dto.UserInfoDto
import com.example.kopring.user.service.UserService
import org.springframework.stereotype.Service

@Service
class APIService(
    private val userService: UserService,
) {

    fun checkId(id: String): String{
        println("check id: $id")
        println("result: ${userService.idMatch(id)}")
        return userService.idMatch(id)
    }
    fun getUserInfo(id: String): UserInfoDto?{
        return userService.getUserInfo(id)

    }

}