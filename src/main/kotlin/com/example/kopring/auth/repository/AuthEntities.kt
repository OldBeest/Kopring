package com.example.kopring.auth.repository

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.sql.Timestamp

@Entity
@Table(name = "userdb")
class AuthEntities (
    @Id
    @Column(name = "id")
    var id: String?,

    @Column(name = "name")
    var name: String?,

    @Column(name = "pw")
    var pw: String?,

    @Column(name = "email")
    var email: String?,

)