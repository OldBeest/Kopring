package com.example.kopring.user.controller

import com.example.kopring.user.dto.UserInfoDto
import com.example.kopring.user.service.UserService
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import java.time.LocalDate

@Controller
class UserController(private val userService: UserService) {

    @PostMapping("/signup")
    fun signUp(@RequestBody userInfoDto: UserInfoDto) : Unit{
        userService.createUser(userInfoDto)
    }
}