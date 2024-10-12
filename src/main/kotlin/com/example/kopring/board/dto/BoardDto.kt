package com.example.kopring.board.dto

import com.example.kopring.board.entity.NoticeEntities
import com.example.kopring.board.service.PostService
import com.example.kopring.board.entity.PostEntities
import org.springframework.stereotype.Component

@Component
data class BoardDto(private val postService: PostService) {
    var noticeDto: List<NoticeEntities> = emptyList()
    var postDto: List<PostEntities> = emptyList()

    init {
        refreshData()
    }

    final fun refreshData() {
        noticeDto = postService.getNoticeList()
        postDto = postService.getList()
    }
}