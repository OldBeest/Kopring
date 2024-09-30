package com.example.kopring.board.repository

import com.example.kopring.facility.repository.PostEntities
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface PostRepository: CrudRepository<PostEntities, String> {

    override fun findAll(): List<PostEntities>

    @Query(value = "select * from postdb order by post_group desc, post_step asc", nativeQuery = true)
    fun getList(): List<PostEntities>

}