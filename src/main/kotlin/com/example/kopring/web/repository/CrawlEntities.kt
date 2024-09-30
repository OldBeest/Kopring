package com.example.kopring.web.repository

import jakarta.persistence.*

@Entity
@Table(name = "crawlingdb")
class CrawlEntities(
    @Id
    @Column(name="news_title")
    var news_title: String?,

    @Column(name="news_content")
    var news_content: String?,

    @Column(name="news_url")
    var news_url: String?,

    @Column(name="video_url")
    var video_url: String?,
)