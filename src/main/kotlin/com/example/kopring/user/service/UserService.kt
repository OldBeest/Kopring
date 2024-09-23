package com.example.kopring.user.service

import com.example.kopring.user.repository.UserEntities
import com.example.kopring.user.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(var userRepository: UserRepository) {

    @Transactional(readOnly = true)
    fun getList(): List<UserEntities> = userRepository.findAll()

}

