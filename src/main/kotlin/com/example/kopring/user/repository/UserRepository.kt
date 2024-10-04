package com.example.kopring.user.repository


import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UserRepository: CrudRepository<UserEntities, String> {
    override fun findAll(): List<UserEntities>

    fun existsByIdAndPw(@Param("user_id") id: String, @Param("user_pw") pw: String) :Boolean

    override fun findById(@Param("user_id") id: String): Optional<UserEntities>

    override fun existsById(@Param("user_id") id: String): Boolean

}