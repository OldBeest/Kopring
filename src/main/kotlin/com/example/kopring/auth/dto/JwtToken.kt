package com.example.kopring.auth.dto

data class JwtToken(val id: String){
    var accessToken: String? = null
    var refreshToken: String? = null
    var tokenType: String? = null
    var issuedAt: String? = null
}