package com.example.kopring.board.repository

import com.example.kopring.board.entity.NoticeEntities
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface NoticeRepository: JpaRepository<NoticeEntities, Long> {

    @Query(value = "select * from noticedb order by post_id desc", nativeQuery = true)
    fun getNoticeList(): List<NoticeEntities>

    //fun addNotice(notice: NoticeEntities): Int
}