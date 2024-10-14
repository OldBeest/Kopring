package com.example.kopring.board.dto

import com.example.kopring.board.entity.NoticeEntities
import com.example.kopring.board.service.PostService
import com.example.kopring.board.entity.PostEntities
import org.springframework.stereotype.Component

@Component
data class BoardDto(private val postService: PostService) {
    var noticeDto: List<NoticeEntities> = emptyList()
    var postDto: MutableList<PostDto> = mutableListOf()

    init {
        refreshData()
    }

    final fun refreshData() {
        noticeDto = postService.getNoticeList()

        val entities: List<PostEntities> = postService.getList()

        for(data in entities){
            postDto.add(PostDto.fromEntity(data))

        }
        for(data in postDto){
            data.replyCount = postService.countByPostNo(data.postNo!!)
        }


    }
}