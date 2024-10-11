package com.example.kopring.auth.service
import com.example.kopring.auth.dto.JwtToken
import com.example.kopring.auth.entity.BlackListTokenEntities
import com.example.kopring.auth.repository.AuthRepository
import com.example.kopring.user.repository.UserRepository
import org.springframework.stereotype.Service
import java.sql.Timestamp
import java.time.Instant
import java.time.LocalDateTime
import java.util.*


@Service
class AuthService(
    var userRepository: UserRepository,
    var authRepository: AuthRepository,
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
            token.tokenType = "Bearer"
            token.issuedAt = LocalDateTime.now().toString()
            return token
        }
        else{
            return null
        }
    }

    fun blacklist_token(token: String){
        var now = Timestamp.from(Instant.now())
        var blacklist_token: BlackListTokenEntities = BlackListTokenEntities(token, now)
        authRepository.save(blacklist_token)
    }

}