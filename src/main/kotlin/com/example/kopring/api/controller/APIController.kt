package com.example.kopring.api.controller

import com.example.kopring.api.service.APIService
import com.example.kopring.user.service.UserService
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
}