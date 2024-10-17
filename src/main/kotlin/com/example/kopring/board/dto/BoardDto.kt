package com.example.kopring.board.dto

import com.example.kopring.board.entity.NoticeEntities
import com.example.kopring.board.service.PostService
import com.example.kopring.board.entity.PostEntities
import org.springframework.stereotype.Component

data class BoardDto(private val postService: PostService, val category: String?, val value: String?) {
    var noticeDto: List<NoticeEntities> = emptyList()
    var postDto: List<PostEntities> = emptyList()
    var replyCountList: List<ReplyCountDto> = emptyList()

    init {
        refreshData(category, value)
        println("category: $category")
        println("content: $value")
    }

    private fun refreshData(category: String?, value: String?) {
        noticeDto = postService.getNoticeList()
        if (category != null && value != null) {
            postDto = postService.getCategoryList(category, value)
        }else{
            postDto = postService.getList()
        }
        replyCountList = postService.countRepliesByPostNo()
    }
}