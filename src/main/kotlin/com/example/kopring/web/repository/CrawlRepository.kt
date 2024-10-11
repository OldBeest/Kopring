package com.example.kopring.web.repository

import com.example.kopring.web.entity.CrawlEntities
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface CrawlRepository: CrudRepository<CrawlEntities, String> {
    override fun findAll(): List<CrawlEntities>
}