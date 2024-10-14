package com.example.kopring.board.service

import com.example.kopring.board.dto.PostDto
import com.example.kopring.board.dto.ReplyDto
import com.example.kopring.board.entity.NoticeEntities
import com.example.kopring.board.repository.NoticeRepository
import com.example.kopring.board.repository.PostRepository
import com.example.kopring.board.entity.PostEntities
import com.example.kopring.board.repository.ReplyRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
class PostService(
    private val postRepository: PostRepository,
    private val noticeRepository: NoticeRepository,
    private val replyRepository: ReplyRepository
) {
    // 공지사항 부분
    fun getNoticeList(): List<NoticeEntities> = noticeRepository.getNoticeList()

    fun getList(): List<PostEntities> = postRepository.findAllByOrderByPostNoDescPostGroupDescPostStepAsc()

    fun countByPostNo(postNo: Int): Int = replyRepository.countByPostNo(postNo)

    fun getPost(postNo: Int?): PostDto?{
        return postRepository.findByPostNo(postNo)?.let { PostDto.fromEntity(it) }
    }

    fun createPost(postDto: PostDto): Unit{
        postRepository.save(postDto.toEntity(postDto))
    }

    fun updatePost(postDto: PostDto): Unit{
        postRepository.save(postDto.toEntity(postDto))
    }

    @Transactional
    fun deletePost(postNo: Int): Unit{
        postRepository.deleteByPostNo(postNo)
    }

    fun getReplyList(postNo: Int): List<ReplyDto>?{
        return replyRepository.findAllByPostNoOrderByReplyOrderDesc(postNo)?.map{ReplyDto.fromEntity(it)}
    }

    fun createReply(replyDto: ReplyDto): Unit{
        replyRepository.save(replyDto.toEntity(replyDto))
    }

    fun updateReply(replyDto: ReplyDto): Unit{
        replyRepository.save(replyDto.toEntity(replyDto))
    }
    @Transactional
    fun deleteReply(replyId: Int): Unit{
        replyRepository.deleteByReplyId(replyId)
    }

}