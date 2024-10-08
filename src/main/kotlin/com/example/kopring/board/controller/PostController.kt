package com.example.kopring.board.controller

import com.example.kopring.board.dto.BoardDto
import com.example.kopring.board.dto.PostDto
import com.example.kopring.board.service.PostService
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.server.ResponseStatusException

@Controller
class PostController(private var boardDto: BoardDto, private var postService: PostService) {

    @ResponseBody
    @GetMapping("/board")
    fun boardList(): BoardDto {
        return boardDto
    }

    @ResponseBody
    @GetMapping("/post/{post_id}")
    fun getPost(@PathVariable post_id: Int): PostDto? {
        var post: PostDto? = postService.getPost(post_id)
        return post ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Post not found")
    }

    @ResponseBody
    @PostMapping("/post")
    fun createPost(@RequestBody postDto: PostDto): String {
        postService.createPost(postDto)
        return "rediriect:/board"
    }

    @ResponseBody
    @PatchMapping("/post")
    fun updatePost(@RequestBody postDto: PostDto): String {
        postService.updatePost(postDto)
        return "rediriect:/board"
    }

    @DeleteMapping("/post")
    fun deletePost(@RequestParam postNo: Int): String {
        postService.deletePost(postNo)
        return "rediriect:/board"
    }
}