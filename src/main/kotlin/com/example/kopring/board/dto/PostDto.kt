package com.example.kopring.board.dto

import com.example.kopring.board.service.PostService
import com.example.kopring.facility.repository.PostEntities
import org.springframework.stereotype.Component

@Component
data class PostDto(private val postService: PostService) {

    fun getPost(post_no: Int): PostEntities{
        return postService.getPost(post_no)
    }
}