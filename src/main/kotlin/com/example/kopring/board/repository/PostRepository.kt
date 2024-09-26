package com.example.kopring.board.repository

import com.example.kopring.facility.repository.FacilityEntities
import com.example.kopring.facility.repository.PostEntities
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface PostRepository: CrudRepository<PostEntities, String> {
    override fun findAll(): List<PostEntities>
}