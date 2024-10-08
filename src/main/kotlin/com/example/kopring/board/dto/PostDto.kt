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
    fun toEntity(postDto: PostDto): PostEntities{
        return PostEntities().apply {
            postNo = postDto.postNo //this@PostDto.postNo도 가능
            id = postDto.id
            postTitle = postDto.postTitle
            postContent = postDto.postContent
            postGroup = postDto.postGroup
            postStep = postDto.postStep
            postIndent = postDto.postIndent
            postHit = postDto.postHit
            postRegDate = postDto.postRegDate
            postFile = postDto.postFile
            isNotice = postDto.isNotice

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