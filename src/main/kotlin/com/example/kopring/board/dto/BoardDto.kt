package com.example.kopring.board.dto

import com.example.kopring.board.repository.NoticeEntities
import com.example.kopring.board.service.PostService
import com.example.kopring.facility.repository.PostEntities
import org.springframework.stereotype.Component

@Component
data class BoardDto(private val postService: PostService) {
    var noticeDto: List<NoticeEntities> = postService.getNoticeList()
    var postDto: List<PostEntities> = postService.getList()
}