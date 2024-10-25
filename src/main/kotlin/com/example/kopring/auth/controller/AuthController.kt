package com.example.kopring.auth.controller

import com.example.kopring.auth.dto.JwtToken
import com.example.kopring.auth.service.AuthService
import com.example.kopring.auth.service.JwtService
import com.example.kopring.auth.service.SocialLoginService
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.json.simple.JSONObject
import org.springframework.boot.json.GsonJsonParser
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity

import org.springframework.web.bind.annotation.*
import kotlin.reflect.typeOf

@Tag(name = "Auth Controller", description = "인증 API")
@RequestMapping("/auth")
@RestController
class AuthController(
    var authService: AuthService,
    var socialLoginService: SocialLoginService
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

    @PostMapping("/logout")
    fun logout(@RequestHeader headers: HttpHeaders, response: HttpServletResponse): Unit{
        val token: String = headers["Cookie"].toString().substringAfter("refreshToken=")
        authService.blacklist_token(token)

        val cookie: Cookie = Cookie("refreshToken", null).apply{
            maxAge = 0
            path = "/"
        }
        response.addCookie(cookie)
    }

    @PostMapping("/get_userid")
    fun get_userid(@RequestHeader headers: HttpHeaders): String? {
        val token: String = headers["Authorization"].toString().substringAfter("Bearer ")
        val userid: String? = authService.get_id_from_token(token)
        println("userid: $userid")
        return userid
    }

    @ResponseBody
    @PostMapping("/naver_login")
    fun naver_login(@RequestBody body: JSONObject): ResponseEntity<Any> {
        val jObject = JSONObject(body)
        val code: String = jObject.getValue("code").toString()
        return ResponseEntity.ok(socialLoginService.getNaverToken(code))
    }
}