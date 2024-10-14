package com.example.kopring.board.repository

import com.example.kopring.board.entity.PostEntities
import org.springframework.data.domain.Sort
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PostRepository: JpaRepository<PostEntities, String> {

    fun findAllByOrderByPostNoDescPostGroupDescPostStepAsc(): List<PostEntities>

    //Create, Update
    fun save(postEntities: PostEntities): Unit

    //Read
    fun findByPostNo(postNo: Int?): PostEntities?

    //Delete
    fun deleteByPostNo(postNo: Int?): Unit
}