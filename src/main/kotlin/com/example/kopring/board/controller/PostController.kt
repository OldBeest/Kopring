package com.example.kopring.board.controller

import com.example.kopring.board.dto.BoardDto
import com.example.kopring.board.dto.PostDto
import com.example.kopring.board.dto.ReplyDto
import com.example.kopring.board.service.PostService
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@Tag(name = "Post Controller", description = "게시글, 댓글 API")
@Controller
class PostController(private var postService: PostService) {

    @ResponseBody
    @GetMapping("/board")
    fun boardList(@RequestParam category: String?, @RequestParam value: String?): BoardDto {
        if (category != null && value != null) {
            return BoardDto(postService, category, value)
        }
        val boardDto = BoardDto(postService, category, value)
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
        return "redirect:/board"
    }

    @ResponseBody
    @PutMapping("/post")
    fun updatePost(@RequestBody postDto: PostDto): String {
        postService.updatePost(postDto)
        return "redirect:/post"
    }

    @DeleteMapping("/post")
    fun deletePost(@RequestParam postNo: Int): ResponseEntity<Void> {
        postService.deletePost(postNo)
        return ResponseEntity.noContent().build()
    }

    @ResponseBody
    @PostMapping("/post/reply")
    fun createReply(@RequestBody replyDto: ReplyDto): String {
        postService.createReply(replyDto)
        return "redirect:/post"
    }

    @ResponseBody
    @PutMapping("/post/reply")
    fun updateReply(@RequestBody replyDto: ReplyDto): String {
        postService.updateReply(replyDto)
        return "redirect:/post"
    }

    @DeleteMapping("/post/reply")
    fun deleteReply(@RequestParam replyId: Int): ResponseEntity<Void> {
        postService.deleteReply(replyId)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/post/thumbsup")
    fun checkThumbsUp(@RequestParam("replyId") replyId: Int, @RequestParam("userId") userId: String): ResponseEntity<Void> {
        if(postService.checkThumbsUp(replyId, userId) != null) {
            return ResponseEntity.ok().build()
        } else{
            return ResponseEntity.noContent().build()
        }

    }

    @PostMapping("/post/thumbsup")
    fun thumbsUp(@RequestParam("replyId") replyId: Int, @RequestParam("userId") userId: String): ResponseEntity<Void> {
        postService.thumbsUpReply(replyId, userId)
        return ResponseEntity.ok().build()
    }
}
