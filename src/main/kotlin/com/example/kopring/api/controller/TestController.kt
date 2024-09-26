package com.example.kopring.api.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TestController {

    @GetMapping("/health")
    fun healthTest(): String {
        return "hello world kotlin!"
    }
}