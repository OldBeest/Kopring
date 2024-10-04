package com.example.kopring.board.dto

import com.example.kopring.facility.repository.PostEntities

import java.sql.Timestamp

data class PostDto(
   var postNo: Int? = null ,
   var id: String? = null,
   var postTitle: String? = null,
   var postContent: String? = null,
   var postGroup: Int? = null,
   var postStep: Int? = null,
   var postIndent: Int? = null,
   var postHit: Int? = null,
   var postRegDate: Timestamp? = null,
   var postFile: String? = null,
   var isNotice: Int? = 0)
{
    fun toEntity(entities: PostEntities): PostEntities{
        return entities.apply {
            postNo = this.postNo //this@PostDto.postNo도 가능
            id = this.id
            postTitle = this.postTitle
            postContent = this.postContent
            postGroup = this.postGroup
            postStep = this.postStep
            postIndent = this.postIndent
            postHit = this.postHit
            postRegDate = this.postRegDate
            postFile = this.postFile
            isNotice = this.isNotice
        }
    }

    companion object {
        fun fromEntity(entities: PostEntities): PostDto{
            return PostDto(
                postNo = entities.postNo,
                id = entities.id,
                postTitle = entities.postTitle,
                postContent = entities.postContent,
                postGroup = entities.postGroup,
                postStep = entities.postStep,
                postIndent = entities.postIndent,
                postHit = entities.postHit,
                postRegDate = entities.postRegDate,
                postFile = entities.postFile,
                isNotice = entities.isNotice
            )
        }
    }

}