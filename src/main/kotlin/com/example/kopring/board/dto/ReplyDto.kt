package com.example.kopring.board.dto

import com.example.kopring.board.entity.PostEntities
import com.example.kopring.board.entity.ReplyEntities
import java.sql.Timestamp

data class ReplyDto(
    var postNo: Int? = null,
    var id: String? = null,
    var replyRegDate: Timestamp? = null,
    var replyContent: String? = null,
    var replyOrder: Int? = null,
    var replyId: Int? = null,
    var replyLike: Int? = null)
{
    fun toEntity(replyDto: ReplyDto): ReplyEntities {
        return ReplyEntities().apply {
           postNo = replyDto.postNo
            id = replyDto.id
            replyContent = replyDto.replyContent
            replyRegDate = replyDto.replyRegDate
            replyOrder = replyDto.replyOrder
            replyId = replyDto.replyId
            replyLike = replyDto.replyLike
        }
    }

    companion object {
        fun fromEntity(entities: ReplyEntities): ReplyDto {
            return ReplyDto(
                postNo = entities.postNo,
                id = entities.id,
                replyContent = entities.replyContent,
                replyRegDate = entities.replyRegDate,
                replyOrder = entities.replyOrder,
                replyId = entities.replyId,
                replyLike = entities.replyLike
            )
        }
    }
}