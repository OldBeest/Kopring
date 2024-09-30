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
    var noticeTitle: String? = null,

    @Column(name = "notice_content")
    var noticeContent: String? = null,

    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
    @Column(name = "notice_reg_date")
    val noticeRegDate: Timestamp? = null,

    @Column(name = "notice_hit")
    var noticeHit: Int? = null,

    @Column(name = "notice_file")
    var noticeFile: String? = null,

    )
