package com.example.kopring.facility.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "favoritedb")
class FavoriteEntities(user_id: String, facility_address: String
){

    @Column(name ="user_id")
    var userId: String = user_id

    @Id
    @Column(name = "facility_address")
    var facilityAddress: String = facility_address
}


