package com.example.kopring.auth.dto

data class JwtToken(
    private val accessToken: String,
    private val refreshToken: String,
    private val tokenType: String,
    private val expiresIn: Int
)