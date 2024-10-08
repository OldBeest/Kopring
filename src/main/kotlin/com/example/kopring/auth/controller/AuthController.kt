package com.example.kopring.auth.controller

import com.example.kopring.auth.service.AuthService
import com.example.kopring.auth.service.JwtService
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.http.HttpHeaders


import org.springframework.web.bind.annotation.*

@RequestMapping("/auth")
@RestController
class AuthController(
    var authService: AuthService,
) {

    @PostMapping("/check_auth")
    fun check_auth(@RequestBody data: String): String?{
        var mapper: Map<String, String>  = jacksonObjectMapper().readValue(data)
        var id: String = mapper.get("id").toString()
        var pw: String = mapper.get("pw").toString()
        return authService.normal_Auth(id, pw)
    }

    // 토큰키 부여
    @PostMapping("/check_auth1")
    fun check_auth1(@RequestParam("id") id: String, @RequestParam("pw") pw: String): String?{
        return authService.normal_Auth(id, pw)
    }

    // 토큰 유효성 검사

    @PostMapping("/check_token")
    fun check_token_vaild(@RequestHeader token: HttpHeaders): String?{
        return ""
    }

    @PostMapping("/refresh_token")
    fun refresh_token(@RequestBody data: String): String? {

        return ""
    }


}