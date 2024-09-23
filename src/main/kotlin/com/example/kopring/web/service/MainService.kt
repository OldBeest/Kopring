package com.example.kopring.web.service

import com.example.kopring.web.repository.CrawlEntities
import com.example.kopring.web.repository.CrawlRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class MainService(
    private var crawlRepository: CrawlRepository) {

    @Transactional(readOnly = true)
    fun getList(): List<CrawlEntities> = crawlRepository.findAll()
}