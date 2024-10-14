package com.example.kopring.board.repository

import com.example.kopring.board.entity.PostEntities
import com.example.kopring.board.entity.ReplyEntities
import org.springframework.data.jpa.repository.JpaRepository

interface ReplyRepository: JpaRepository<ReplyEntities, Int> {

    fun findAllByPostNoOrderByReplyOrderDesc(postId: Int?): List<ReplyEntities>?

    fun countByPostNo(postId: Int?): Int

    fun save(replyEntities: ReplyEntities): Unit

    fun deleteByReplyId(replyId: Int): Unit
}