package com.example.kopring.user.repository

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

    @Column(name = "birth_date")
    var birth_date: Timestamp?,

    @Column(name = "phone")
    var phone: String?,

    @Column(name = "auto_login_token")
    var auto_login_token: String?,

    @Column(name = "temppw")
    var temppw: String?,

    @Column(name = "gender")
    var gender: String?,

    @Column(name = "join_date")
    var join_date: Timestamp?,

    @Column(name = "disease")
    var disease: String?,

    @Column(name = "feature")
    var feature: String?,

    @Column(name = "address")
    var address: String?,

)