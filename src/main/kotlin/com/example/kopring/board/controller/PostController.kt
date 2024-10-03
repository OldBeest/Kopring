package com.example.kopring.board.controller

import com.example.kopring.board.dto.BoardDto
import com.example.kopring.board.dto.PostDto
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class PostController(private var boardDto: BoardDto, private var postDto: PostDto) {

    @ResponseBody
    @GetMapping("/board")
    fun boardList(): BoardDto {
        return boardDto
    }

    @ResponseBody
    @GetMapping("/post/{post_id}")
    fun getPost(@PathVariable post_id: Int): PostDto? {
        return postDto.getPost(post_id)
    }
}