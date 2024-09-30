package com.example.kopring.board.controller

import com.example.kopring.board.dto.BoardDto
import com.example.kopring.board.repository.NoticeEntities
import com.example.kopring.board.service.PostService
import com.example.kopring.facility.repository.PostEntities
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class PostController(private var boardDto: BoardDto) {

    @ResponseBody
    @GetMapping("/board")
    fun boardList(): BoardDto {
        return boardDto
    }
}