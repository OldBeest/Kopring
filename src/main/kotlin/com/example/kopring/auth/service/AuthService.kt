package com.example.kopring.auth.service
import com.example.kopring.auth.dto.JwtToken
import com.example.kopring.user.repository.UserRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime



@Service
class AuthService(
    var userRepository: UserRepository,
    var jwtService: JwtService,
) {
    private var token: JwtToken? = null

    //아이디, 비밀번호 인증
    fun normal_Auth(id: String, pw: String): JwtToken?{
        if(userRepository.existsByIdAndPw(id, pw)){
            token = JwtToken(id)
            token?.accessToken = jwtService.generateToken(id)
            token?.refreshToken = jwtService.generateToken(id, 24 * 60 * 60 * 1000L)
            token?.tokenType = "Bearer"
            token?.issuedAt = LocalDateTime.now().toString()


            return token
        }
        return null
    }

    //
    fun refresh_token(token: String): JwtToken?{
        if(jwtService.checkRefreshToken(token)){
            val token: JwtToken = JwtToken(jwtService.getUserIDFromToken(token))
            token.accessToken = jwtService.generateToken(token.id)
            return token
        }
        else{
            return null
        }
    }

}