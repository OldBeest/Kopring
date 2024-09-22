package com.example.kopring.user.service

import com.example.kopring.user.repository.UserEntities
import com.example.kopring.user.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(var userRepository: UserRepository) {
    fun getList() = userRepository.findAll()

}

