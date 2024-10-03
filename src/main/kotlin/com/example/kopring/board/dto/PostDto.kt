package com.example.kopring.board.dto

import com.example.kopring.facility.repository.PostEntities
import java.sql.Timestamp

data class PostDto(
    private var postNo: Int? = null,
   private var id: String? = null,
   private var postTitle: String? = null,
   private var postContent: String? = null,
   private var postGroup: Int? = null,
   private var postStep: Int? = null,
   private var postIndent: Int? = null,
   private var postHit: Int? = null,
   private var postRegDate: Timestamp? = null,
   private var postFile: String? = null,
   private var isNotice: Int? = 0){

    init{
        println("Post Dto 생성!")
    }
    fun toEntity(): PostEntities{
        return
    }
    fun fromEntity(entities: PostEntities): PostDto{
        return PostDto().apply {  }
    }
}