package com.example.kopring.board.entity

import jakarta.persistence.*

@Entity
@Table(name = "thumbsupdb")
class ThumbsUpEntities {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null // 기본 키 필드 추가

    @Column(name = "user_id")
    var userId: String? = null

    @Column(name = "reply_id")
    var replyId : Int? = null


}