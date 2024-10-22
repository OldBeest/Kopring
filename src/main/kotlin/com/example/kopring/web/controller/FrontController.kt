package com.example.kopring.web.controller

import com.example.kopring.web.dto.MainPageDto
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody

@Tag(name = "Front Controller", description = "메인 화면 API")
@Controller
class FrontController(private var mainPageDto: MainPageDto) {

    @ResponseBody
    @GetMapping("/index")
    fun home(): MainPageDto {
        return mainPageDto
    }
}