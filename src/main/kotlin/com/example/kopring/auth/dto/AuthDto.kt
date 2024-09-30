package com.example.kopring.auth.dto

data class AuthDto(
    private val id: String,
    private val pw: String,
    private val email: String,
    private val token: String
)