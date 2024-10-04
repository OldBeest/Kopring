package com.example.kopring.board.service

import com.example.kopring.board.dto.PostDto
import com.example.kopring.board.repository.NoticeEntities
import com.example.kopring.board.repository.NoticeRepository
import com.example.kopring.board.repository.PostRepository
import com.example.kopring.facility.repository.PostEntities
import org.springframework.stereotype.Service


@Service
class PostService(private val postRepository : PostRepository,
    private val noticeRepository: NoticeRepository
) {
    // 공지사항 부분
    fun getNoticeList(): List<NoticeEntities> = noticeRepository.getNoticeList()
    fun getList(): List<PostEntities> = postRepository.getList()
    fun createPost(): Unit{
        println("Creating post")
    }
    fun getPost(postNo: Int?): PostDto?{
        return postRepository.findByPostNo(postNo)?.let { PostDto.fromEntity(it) }
    }
}