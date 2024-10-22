package com.example.kopring.board.repository

import com.example.kopring.board.entity.PostEntities
import com.example.kopring.board.entity.ReplyEntities
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface ReplyRepository: JpaRepository<ReplyEntities, Int> {

    fun findAllByPostNoOrderByReplyOrderDesc(postId: Int?): List<ReplyEntities>?

    fun countByPostNo(postId: Int?): Int

    @Query("""
    SELECT p.postNo, COUNT(r) 
    FROM PostEntities p 
    LEFT JOIN ReplyEntities r ON p.postNo = r.postNo 
    GROUP BY p.postNo
    ORDER BY p.postNo DESC
    """)
    fun countRepliesByPostNo(): List<Any>

    fun save(replyEntities: ReplyEntities): Unit

    fun deleteByReplyId(replyId: Int): Unit

    @Query("SELECT MAX(reply_id) from replydb order by reply_id desc", nativeQuery = true)
    fun findMaxReplyId(): Int?
}