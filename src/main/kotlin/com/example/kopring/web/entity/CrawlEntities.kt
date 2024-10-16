package com.example.kopring.web.entity

import jakarta.persistence.*

@Entity
@Table(name = "crawlingdb")
class CrawlEntities(
    @Id
    @Column(name="news_title")
    var newsTitle: String?,

    @Column(name="news_content", length = 2000)
    var newsContent: String?,

    @Column(name="news_url")
    var newsUrl: String?,

    @Column(name="video_url")
    var videoUrl: String?,
)