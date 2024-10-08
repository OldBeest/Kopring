package com.example.kopring.board.repository

import com.example.kopring.board.dto.PostDto
import com.example.kopring.facility.repository.PostEntities
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface PostRepository: JpaRepository<PostEntities, String> {

    override fun findAll(): List<PostEntities>

    @Query(value = "select * from postdb order by post_no desc, post_group desc, post_step asc", nativeQuery = true)
    fun getList(): List<PostEntities>

    //Create, Update
    fun save(postEntities: PostEntities): Unit


    //Read
    fun findByPostNo(postNo: Int?): PostEntities?

    //Delete
    fun deleteByPostNo(postNo: Int?): Unit
}