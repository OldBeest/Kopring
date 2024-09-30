package com.example.kopring.web.repository

import jakarta.persistence.*

@Entity
@Table(name = "crawlingdb")
class CrawlEntities(
    @Id
    @Column(name="news_title")
    var newsTitle: String?,

    @Column(name="news_content")
    var newsContent: String?,

    @Column(name="news_url")
    var newsUrl: String?,

    @Column(name="video_url")
    var videoUrl: String?,
)