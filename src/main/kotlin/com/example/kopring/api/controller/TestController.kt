package com.example.kopring.api.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api")
@RestController
class TestController {

    @GetMapping("/health")
    fun healthTest(): String {
        return "hello world kotlin!"
    }

    @GetMapping("/facility")
    fun facilityTest(): String {
        return "facility list"
    }
}