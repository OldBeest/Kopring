package com.example.kopring.auth.service


import com.example.kopring.auth.dto.JwtToken
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.util.JSONPObject
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.json.simple.JSONObject
import org.json.simple.parser.JSONParser
import org.springframework.stereotype.Service
import kotlin.reflect.typeOf


@Service
class SocialLoginService(private val jwtService: JwtService,) {

    fun getNaverToken(code: String ,CLIENT_ID: String, CLIENT_SECRET: String, STATE: String): String?{

        val client = okhttp3.OkHttpClient()

        val url = "https://nid.naver.com/oauth2.0/token"

        val requestbody = okhttp3.FormBody.Builder()
            .add("grant_type", "authorization_code")
            .add("client_id", CLIENT_ID)
            .add("client_secret", CLIENT_SECRET)
            .add("state", STATE)
            .add("code", code)
            .build()

        val request = okhttp3.Request.Builder()
            .url(url)
            .post(requestbody)
            .build()

        client.newCall(request).execute().use { response ->
            return response.body?.string()
        }



    }

    fun getTokenForKakaoUser(accessToken: String): String? {
        val client = okhttp3.OkHttpClient()

        val url = "https://kapi.kakao.com/v2/user/me"
        val request = okhttp3.Request.Builder()
            .addHeader("Authorization", "Bearer ${accessToken}")
            .addHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8")
            .url(url)
            .get()
            .build()

        client.newCall(request).execute().use { response ->
            //readvalue, readtree
            val json = ObjectMapper().readValue(response.body?.string(), JsonNode::class.java)
            val id =  json.get("id").toString()


            val kakaoJWT: String = jwtService.generateToken(id)

            return kakaoJWT
        }

    }

    fun getTokenForNaverUser(accessToken: String): String? {
        val client = okhttp3.OkHttpClient()

        val url = "https://openapi.naver.com/v1/nid/me"
        val request = okhttp3.Request.Builder()
            .addHeader("Authorization", "Bearer ${accessToken}")
            .url(url)
            .get()
            .build()

        client.newCall(request).execute().use { response ->
            //readvalue, readtree
            val json = ObjectMapper().readValue(response.body?.string(), JsonNode::class.java)
            val id =  json.get("response").get("id").toString().replace("\"", "")

            val naverJWT: String = jwtService.generateToken(id)

            return naverJWT
        }

    }

    fun getTokenForGoogleUser(accessToken: String): String? {
        val client = okhttp3.OkHttpClient()
        val url = "https://www.googleapis.com/userinfo/v2/me"
        val request = okhttp3.Request.Builder()
            .addHeader("Authorization", "Bearer ${accessToken}")
            .url(url)
            .get()
            .build()

        client.newCall(request).execute().use { response ->
            val json = ObjectMapper().readValue(response.body?.string(), JsonNode::class.java)
            val id =  json.get("id").toString().replace("\"", "")

            val googleJWT: String = jwtService.generateToken(id)

            return googleJWT
        }
    }
}