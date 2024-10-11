package com.example.kopring.board.dto

import com.example.kopring.board.entity.PostEntities
import com.example.kopring.board.entity.ReplyEntities
import java.sql.Timestamp

data class ReplyDto(
    var postNo: Int? = null,
    var id: String? = null,
    var replyContent: String? = null,
    var replyDate: Timestamp? = null,
    var replyOrder: Int? = null)
{
    fun toEntity(replyDto: ReplyDto): ReplyEntities {
        return ReplyEntities().apply {
           postNo = replyDto.postNo
            id = replyDto.id
            replyContent = replyDto.replyContent
            replyDate = replyDto.replyDate
            replyOrder = replyDto.replyOrder
        }
    }

    companion object {
        fun fromEntity(entities: ReplyEntities): ReplyDto {
            return ReplyDto(
                postNo = entities.postNo,
                id = entities.id,
                replyContent = entities.replyContent,
                replyDate = entities.replyDate,
                replyOrder = entities.replyOrder
            )
        }
    }
}