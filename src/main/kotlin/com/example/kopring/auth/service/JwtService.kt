package com.example.kopring.auth.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import java.security.Key
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*

@Component
object JwtService{

    private val TEN_MINUTES: Long = 1000L * 60 * 10
    val EXPIRATION_TIME: Long = TEN_MINUTES
    private val SECRET_KEY: String = "your-secret-key-is-very-important"
    private val signingKey: Key = Keys.hmacShaKeyFor(SECRET_KEY.toByteArray(StandardCharsets.UTF_8))?: throw IllegalArgumentException("Secret key not found!")

    fun generateToken(id: String, expirationMillisec: Long = EXPIRATION_TIME): String{
        val now = Date()
        val expiration = Date(now.time + expirationMillisec)
        val claims = generateClaim(now, expiration)

        return Jwts.builder()
            .setClaims(claims)
            .setSubject(id)
            .setIssuedAt(now)
            .setExpiration(expiration)
            .signWith(signingKey, SignatureAlgorithm.HS256)
            .compact()
    }

    fun generateClaim(now: Date, expiration: Date): Map<String, String>{
        val nowLocalDateTime: LocalDateTime = LocalDateTime.ofInstant(now.toInstant(), ZoneId.systemDefault())
        val expirationLocalDateTime: LocalDateTime = LocalDateTime.ofInstant(expiration.toInstant(), ZoneId.systemDefault())

        val mapper: ObjectMapper = jacksonObjectMapper()
        mapper.registerModules(JavaTimeModule())
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

        return mapOf("issuedAt" to mapper.writeValueAsString(nowLocalDateTime),
            "expiredAt" to mapper.writeValueAsString(expirationLocalDateTime))
    }

    fun getUserIDFromToken(token: String): String{

        return Jwts.parserBuilder()
            .setSigningKey(signingKey)
            .build()
            .parseClaimsJws(token)
            .body
            .subject
    }
}