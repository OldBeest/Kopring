package com.example.kopring.user.controller

import com.example.kopring.user.service.AuthService
import org.springframework.web.bind.annotation.*


@RestController
class AuthController(var authService: AuthService) {

    @GetMapping("/auth")
    fun auth(): Boolean{
        var checkAuth: Boolean = authService.normal_Auth("test2", "111133")
        return checkAuth
    }

}