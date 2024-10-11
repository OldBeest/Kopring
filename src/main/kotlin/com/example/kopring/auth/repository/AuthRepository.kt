package com.example.kopring.auth.repository

import com.example.kopring.auth.entity.BlackListTokenEntities
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AuthRepository: JpaRepository<BlackListTokenEntities, String> {

    override fun existsById(id: String): Boolean
}