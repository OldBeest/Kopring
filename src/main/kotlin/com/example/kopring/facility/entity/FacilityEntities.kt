package com.example.kopring.facility.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.sql.Timestamp

@Entity
@Table(name = "facilitydb")
class FacilityEntities {
    @Id
    @Column(name = "name")
    var name: String? = null

    @Column(name = "region_code")
    var region_code: Int? = null

    @Column(name = "region_name")
    var region_name: String? = null

    @Column(name = "address")
    var address: String? = null

    @Column(name = "tel")
    var tel: String? = null

    @Column(name = "reg_date")
    var reg_date: Timestamp? = null

    @Column(name = "doc_count")
    var doc_count: Int? = null

    @Column(name = "disease")
    var disease: String? = null

    @Column(name = "feature")
    var feature: String? = null

    @Column(name = "price")
    var price: Int? = null

    @Column(name = "y_cor")
    var y_cor: Double? = null

    @Column(name = "x_cor")
    var x_cor: Double? = null

    @Column(name = "image_path")
    var image_path: String? = null

    @Column(name = "ad_status")
    var adstatus: Int? = null

}