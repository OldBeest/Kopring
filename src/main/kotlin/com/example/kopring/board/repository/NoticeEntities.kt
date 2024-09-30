package com.example.kopring.board.repository

import com.fasterxml.jackson.annotation.JsonFormat
import jakarta.persistence.*
import java.sql.Timestamp

@Entity
@Table(name = "noticedb")
class NoticeEntities(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    val id: Long? = null,

    @Column(name = "notice_title")
    var notice_title: String? = null,

    @Column(name = "notice_content")
    var notice_content: String? = null,

    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
    @Column(name = "notice_reg_date")
    val notice_reg_date: Timestamp? = null,

    @Column(name = "notice_hit")
    var notice_hit: Int? = null,

    @Column(name = "notice_file")
    var notice_file: String? = null,

    )
