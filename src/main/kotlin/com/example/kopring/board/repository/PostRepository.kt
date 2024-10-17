package com.example.kopring.board.repository

import com.example.kopring.board.entity.PostEntities
import org.springframework.data.domain.Sort
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PostRepository: JpaRepository<PostEntities, String> {

    fun findAllByOrderByPostNoDescPostGroupDescPostStepAsc(): List<PostEntities>

    @Query(""" select * from postdb 
        where (:category = 'id' AND id LIKE %:value%)
        or (:category = 'title' AND post_title LIKE %:value%)
        or (:category = 'content' AND post_content LIKE %:value%)
        or (:category = 'titleAndcontent' AND (post_title LIKE %:value% OR post_content LIKE %:value%))
        order by post_no desc 
    """, nativeQuery = true)
    fun findAllByPostTitleContains(category: String, value: String): List<PostEntities>

    //Create, Update
    fun save(postEntities: PostEntities): Unit

    //Read
    fun findByPostNo(postNo: Int?): PostEntities?

    //Delete
    fun deleteByPostNo(postNo: Int?): Unit
}