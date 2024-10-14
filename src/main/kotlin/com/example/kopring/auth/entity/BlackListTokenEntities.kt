package com.example.kopring.auth.entity

import com.fasterxml.jackson.annotation.JsonFormat
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.sql.Timestamp

@Entity
@Table(name = "blacklisttokendb")
class BlackListTokenEntities(

    @Id
    @Column(name = "refresh_token")
    var refreshToken: String? = null,

    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
    @Column(name = "reg_date")
    var regDate: Timestamp? = null
)