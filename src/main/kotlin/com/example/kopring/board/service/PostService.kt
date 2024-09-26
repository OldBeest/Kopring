package com.example.kopring.board.service

import com.example.kopring.board.repository.PostRepository
import com.example.kopring.facility.repository.PostEntities
import org.springframework.stereotype.Service

@Service
class PostService(private val postRepository : PostRepository) {

    fun getList(): List<PostEntities> = postRepository.findAll()
}