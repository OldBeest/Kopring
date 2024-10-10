package com.example.kopring.auth.service
import com.example.kopring.user.repository.UserRepository
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Service


@Service
class AuthService(
    var userRepository: UserRepository,
    var jwtService: JwtService,
    private val httpServletResponse: HttpServletResponse,
) {

    private var accessToken : String? = null
    private var refreshToken : String? = null
    private var token: Map<String, String> = mutableMapOf()

    //아이디, 비밀번호 인증
    fun normal_Auth(id: String, pw: String): Map<String, String>?{
        if(userRepository.existsByIdAndPw(id, pw)){
            var accessToken = jwtService.generateToken(id)
            var refreshToken = jwtService.generateToken(id, 24 * 60 * 60 * 1000L)

            token = mapOf("access token" to accessToken, "refresh token" to refreshToken )

            return token
        }
        return null
    }

    fun normal_Auth1(id: String, pw: String): String?{
        if(userRepository.existsByIdAndPw(id, pw)){
            var accessToken = jwtService.generateToken(id)
            var refreshToken = jwtService.generateToken(id, 24 * 60 * 60 * 1000L)

            var token_response = httpServletResponse


            token_response.contentType = "application/json; charset=utf-8"
            var cookie: Cookie? = Cookie("refresh-token", refreshToken)
            cookie?.maxAge = 24 * 60 * 60
            token_response.setHeader("access-token", accessToken)
            token_response.addCookie(cookie)
            token_response.status = HttpServletResponse.SC_OK
            return "success"
        }
        return "fail"
    }

    //카카오 인증
    fun kakao_Auth(): Unit{

    }

    fun logout(): Boolean{
        return false
    }

}