package com.example.kopring.board.controller

import com.example.kopring.board.service.PostService
import com.example.kopring.facility.repository.PostEntities
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class PostController(private val postService: PostService) {

    @ResponseBody
    @GetMapping("/board")
    fun testList(): List<PostEntities> {
        var list: List<PostEntities> = postService.getList()
        return list
    }
}