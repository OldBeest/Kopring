package com.example.kopring.user.repository

import com.fasterxml.jackson.annotation.JsonFormat
import jakarta.persistence.*
import java.sql.Timestamp

@Entity
@Table(name = "userdb")
class UserEntities (
    @Id
    @Column(name = "id")
    var id: String?,

    @Column(name = "name")
    var name: String?,

    @Column(name = "pw")
    var pw: String?,

    @Column(name = "email")
    var email: String?,

    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
    @Column(name = "birth_date")
    var birthDate: Timestamp?,

    @Column(name = "phone")
    var phone: String?,

    @Column(name = "auto_login_token")
    var autoLoginToken: String?,

    @Column(name = "temppw")
    var temppw: String?,

    @Column(name = "gender")
    var gender: String?,

    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
    @Column(name = "join_date")
    var joinDate: Timestamp?,

    @Column(name = "disease")
    var disease: String?,

    @Column(name = "feature")
    var feature: String?,

    @Column(name = "address")
    var address: String?,

)