package com.example.kopring.board.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.sql.Timestamp

@Entity
@Table(name = "replydb")
class ReplyEntities {

    @Id
    @Column(name = "reply_id")
    var replyId: Int? = null

    @Column(name = "post_no")
    var postNo: Int? = null

    @Column(name = "id")
    var id: String? = null

    @Column(name = "reply_reg_date" )
    var replyDate: Timestamp? = null

    @Column(name = "reply_content")
    var replyContent: String? = null

    @Column(name = "reply_order")
    var replyOrder: Int? = null

}