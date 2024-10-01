package com.example.kopring.auth.service
import com.example.kopring.user.repository.UserRepository
import org.springframework.stereotype.Service


@Service
class AuthService(
    var userRepository : UserRepository,
    var jwtService: JwtService
    ) {

    private var token : String? = null

    //아이디, 비밀번호 인증
    fun normal_Auth(id: String, pw: String): String?{
        if(userRepository.existsByIdAndPw(id, pw)){
            token = jwtService.generateToken(id)
            return token as String
        }
        return null
    }

    //카카오 인증
    fun kakao_Auth(): Unit{

    }

    fun logout(): Boolean{
        return false
    }

}