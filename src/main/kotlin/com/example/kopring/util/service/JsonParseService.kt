package com.example.kopring.util.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody


@Service
class JsonParseService {

    fun parse_json(@RequestBody data: String): Map<String, String> {
        var mapper: Map<String, String> = jacksonObjectMapper().readValue(data)
        return mapper
    }
}