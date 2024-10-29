package com.example.kopring.config

import com.example.kopring.util.ConfigTestRepository
import com.example.kopring.util.ConfigTestRepositoryImpl
import com.example.kopring.util.ConfigTestService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SpringConfig {

    @Bean
    fun configTestService(): ConfigTestService {
        return ConfigTestService(configTestRepository())
    }

    @Bean
    fun configTestRepository(): ConfigTestRepository {
        return ConfigTestRepositoryImpl()
    }
}
