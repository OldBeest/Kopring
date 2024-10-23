package com.example.kopring.board.repository

import com.example.kopring.board.entity.ThumbsUpEntities
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ThumbsUpRepository: JpaRepository<ThumbsUpEntities, String> {

    fun findByReplyIdAndUserId(replyId: Int, userId: String): ThumbsUpEntities?

    fun save(thumbsUpEntities: ThumbsUpEntities): Unit
}