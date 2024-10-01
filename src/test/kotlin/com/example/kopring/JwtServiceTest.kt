package com.example.kopring

import com.example.kopring.auth.service.JwtService
import io.jsonwebtoken.ExpiredJwtException
import org.junit.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class JwtServiceTest {

    @Test
    fun checkSubAndId(){
        val userId = "my-id"
        val expireTime = JwtService.EXPIRATION_TIME
        val result = JwtService.generateToken(userId, expireTime)
        val userIdFromToken = JwtService.getUserIDFromToken(result)

        assertNotNull(result)
        assertEquals(userId, userIdFromToken)
    }

    @Test
    fun checkInvalidToken(){
        val userId = "my-id"
        val expireTime = 1L
        var result = JwtService.generateToken(userId, expireTime)

        Thread.sleep(100L)
        assertThrows<ExpiredJwtException> { JwtService.getUserIDFromToken(result)}

    }
}