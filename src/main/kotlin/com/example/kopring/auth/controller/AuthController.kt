package com.example.kopring.auth.controller

import com.example.kopring.auth.service.AuthService
import com.example.kopring.auth.service.JwtService
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders

import org.springframework.web.bind.annotation.*
import kotlin.reflect.typeOf

@RequestMapping("/auth")
@RestController
class AuthController(
    var authService: AuthService,
) {
    // 토큰키 부여
    @PostMapping("/get_token")
    fun check_auth1(@RequestParam("id") id: String, @RequestParam("pw") pw: String): Map<String, String>?{
        return authService.normal_Auth(id, pw)
    }
    @PostMapping("/get_token1")
    fun check_auth2(@RequestParam("id") id: String, @RequestParam("pw") pw: String): String?{
        println(id)
        println(pw)
        return authService.normal_Auth1(id, pw)
    }

    // 토큰 유효성 검사
    @PostMapping("/check_token")
    fun check_token_vaild(@RequestHeader headers: HttpHeaders): Boolean?{
        var token = headers["Authorization"].toString().substringAfter("Bearer ")
        return authService.jwtService.checkValidToken(token)

    }

    @PostMapping("/refresh_token")
    fun refresh_token(@RequestBody data: String): String? {

        return ""
    }


}