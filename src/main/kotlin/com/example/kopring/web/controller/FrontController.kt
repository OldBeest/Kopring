package com.example.kopring.web.controller

import com.example.kopring.web.dto.MainPageDto
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class FrontController(private var mainPageDto: MainPageDto) {

    @ResponseBody
    @GetMapping("/index")
    fun home(): MainPageDto {
        return mainPageDto
    }
    @GetMapping("api/demo")
    fun apiDemo(): List<String>{
        return listOf("리액트 스프링", "스프링 연결 성공")
    }
}