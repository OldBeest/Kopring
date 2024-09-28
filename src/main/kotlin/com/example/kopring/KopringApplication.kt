package com.example.kopring

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.runApplication

@SpringBootApplication(exclude = [SecurityAutoConfiguration::class]) //스프링 로그인클래스 비활성화
class KopringApplication

fun main(args: Array<String>) {
	runApplication<KopringApplication>(*args)
}
