package com.example.kopring.auth.controller

import com.example.kopring.auth.service.AuthService
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jsonMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.json.simple.JSONObject
import org.json.simple.parser.JSONParser

import org.springframework.web.bind.annotation.*

@RequestMapping("/auth")
@RestController
class AuthController(var authService: AuthService) {

    @PostMapping("/check_auth")
    fun check_auth(@RequestBody data: String): Boolean{
        var mapper: Map<String, String>  = jacksonObjectMapper().readValue(data)
        var id: String = mapper.get("id").toString()
        var pw: String = mapper.get("pw").toString()
        return authService.normal_Auth(id, pw)
    }
}