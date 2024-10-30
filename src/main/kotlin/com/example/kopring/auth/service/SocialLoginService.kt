package com.example.kopring.auth.service


import org.springframework.stereotype.Service


@Service
class SocialLoginService {

    fun getNaverToken(code: String): String?{

        val CLIENT_ID = "KPEi6hT0KjE7sUpP8CFG"
        val CLIENT_SECRET = "1_TX1xRfzH"
        val STATE = "1234567890987654321"

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

    fun getGoogleToken(code: String): String? {

        val client = okhttp3.OkHttpClient()

        val url = "https://www.googleapis.com/oauth2/v3/userinfo"

        val request = okhttp3.Request.Builder()
            .addHeader("Authorization", "Bearer $code")
            .addHeader("credentials", "include")
            .url(url)
            .get()
            .build()

        client.newCall(request).execute().use { response ->
            return response.body?.string()
        }
    }
}