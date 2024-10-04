package com.example.kopring.facility.repository

import com.fasterxml.jackson.annotation.JsonFormat
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
    var postNo: Int? = null

    @Column(name = "id")
    var id: String? = null

    @Column(name = "post_title")
    var postTitle: String? = null

    @Column(name = "post_content")
    var postContent: String? = null

    @Column(name = "post_group")
    var postGroup: Int? = null

    @Column(name = "post_step")
    var postStep: Int? = null

    @Column(name = "post_indent")
    var postIndent: Int? = null

    @Column(name = "post_hit")
    var postHit: Int? = null
    
    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
    @Column(name = "post_reg_date")
    var postRegDate: Timestamp? = null

    @Column(name = "post_file")
    var postFile: String? = null

    @Column(name = "is_notice")
    var isNotice: Int? = null

}