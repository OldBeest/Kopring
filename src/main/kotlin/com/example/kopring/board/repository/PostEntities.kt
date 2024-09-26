package com.example.kopring.facility.repository

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.sql.Timestamp

@Entity
@Table(name = "postdb")
class PostEntities {
    @Id
    @Column(name = "post_no")
    var post_no: Long = 0

    @Column(name = "id")
    var id: String? = null

    @Column(name = "post_title")
    var post_title: String? = null

    @Column(name = "post_content")
    var post_content: String? = null

    @Column(name = "post_group")
    var post_group: Int? = 0

    @Column(name = "post_step")
    var post_step: Int? = 0

    @Column(name = "post_indent")
    var post_indent: Int? = 0

    @Column(name = "post_hit")
    var post_hit: Int? = 0

    @Column(name = "post_reg_date")
    var post_reg_date: Timestamp? = null

    @Column(name = "post_file")
    var post_file: String? = null

    @Column(name = "is_notice")
    var is_notice: Int? = 0

}