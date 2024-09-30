package com.example.kopring.board.repository

import com.example.kopring.facility.repository.PostEntities
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface NoticeRepository: CrudRepository<NoticeEntities, Long> {

    @Query(value = "select * from noticedb order by post_id desc", nativeQuery = true)
    fun getNoticeList(): List<NoticeEntities>

    //fun addNotice(notice: NoticeEntities): Int
}