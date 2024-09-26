package com.example.kopring.user.service

import com.example.kopring.user.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class AuthService(var userRepository : UserRepository) {

    inner class Auth_status(
        var auth_status: Boolean = false
    )
    //아이디, 비밀번호 인증
    fun normal_Auth(id: String, pw: String): Boolean{
        return userRepository.existsByIdAndPw(id, pw)
    }

    //카카오 인증
    fun kakao_Auth(): Unit{

    }

    fun logout(): Boolean{
        return false
    }

}