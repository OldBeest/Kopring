package com.example.kopring.board.controller

import com.example.kopring.board.dto.BoardDto
import com.example.kopring.board.dto.PostDto
import com.example.kopring.board.dto.ReplyDto
import com.example.kopring.board.service.PostService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
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
class PostController(private var postService: PostService) {

    @ResponseBody
    @GetMapping("/board")
    fun boardList(): BoardDto {
        val boardDto = BoardDto(postService)
        return boardDto
    }

    @ResponseBody
    @GetMapping("/post/{post_id}")
    fun getPost(@PathVariable post_id: Int): PostDto? {
        val post: PostDto? = postService.getPost(post_id)
        val replylist: List<ReplyDto>? = postService.getReplyList(post_id)
        post?.replyList = replylist
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
        return "rediriect:/post"
    }

    @DeleteMapping("/post")
    fun deletePost(@RequestParam postNo: Int): ResponseEntity<Void> {
        postService.deletePost(postNo)
        return ResponseEntity.noContent().build()
    }

    @ResponseBody
    @PostMapping("/post/reply")
    fun createReply(@RequestBody replyDto: ReplyDto): String {
        println("댓글정보 : ${replyDto}")
        postService.createReply(replyDto)
        return "rediriect:/post"
    }

    @ResponseBody
    @PatchMapping("/post/reply")
    fun updateReply(@RequestBody replyDto: ReplyDto): String {
        postService.updateReply(replyDto)
        return "rediriect:/post"
    }

    @DeleteMapping("/post/reply")
    fun deleteReply(@RequestParam replyId: Int): String {
        postService.deleteReply(replyId)
        return "rediriect:/post"
    }
}
