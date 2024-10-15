package com.example.kopring.user.entity

import com.fasterxml.jackson.annotation.JsonFormat
import jakarta.persistence.*
import java.sql.Timestamp

@Entity
@Table(name = "userdb")
class UserEntities (
    @Id
    @Column(name = "id")
    var id: String? = null,

    @Column(name = "name")
    var name: String? = null,

    @Column(name = "pw")
    var pw: String? = null,

    @Column(name = "email")
    var email: String? = null,

    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
    @Column(name = "birth_date")
    var birthDate: Timestamp? = null,

    @Column(name = "phone")
    var phone: String? = null,

    @Column(name = "auto_login_token")
    var autoLoginToken: String? = null,

    @Column(name = "temppw")
    var temppw: String? = null,

    @Column(name = "gender")
    var gender: String? = null,

    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
    @Column(name = "join_date")
    var joinDate: Timestamp? = null,

    @Column(name = "disease")
    var disease: String? = null,

    @Column(name = "feature")
    var feature: String? = null,

    @Column(name = "address")
    var address: String? = null,

)