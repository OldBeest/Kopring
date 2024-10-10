package com.example.kopring.auth.controller

import com.example.kopring.auth.dto.JwtToken
import com.example.kopring.auth.service.AuthService
import com.example.kopring.auth.service.JwtService
import jakarta.servlet.http.Cookie
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
    fun get_token(@RequestParam("id") id: String, @RequestParam("pw") pw: String, response: HttpServletResponse): JwtToken?{

        val token = authService.normal_Auth(id, pw)
        val cookie: Cookie = Cookie("refreshToken", token?.refreshToken).apply{
            isHttpOnly = true
            maxAge = 3600
            path = "/"
            secure = true
        }
        response.addCookie(cookie)

        return token
    }

    // 토큰 유효성 검사
    @PostMapping("/check_token")
    fun check_token_vaild(@RequestHeader headers: HttpHeaders): Boolean?{

        val token = headers["Authorization"].toString().substringAfter("Bearer ")
        if(token == "[Bearer]"){
            return false
        }
        return authService.jwtService.checkValidToken(token)

    }

    @PostMapping("/refresh_token")
    fun get_refresh_token(@RequestHeader headers: HttpHeaders): JwtToken? {
        val token: String = headers["Cookie"].toString().substringAfter("refreshToken=")
        val newtoken: JwtToken? = authService.refresh_token(token)
        return newtoken

    }


}