package com.example.kopring.web.dto

import com.example.kopring.facility.entity.FacilityEntities
import com.example.kopring.facility.service.FacilityService
import com.example.kopring.user.entity.UserEntities
import com.example.kopring.user.service.UserService
import com.example.kopring.web.entity.CrawlEntities
import com.example.kopring.web.service.MainService
import org.springframework.stereotype.Component

@Component
data class MainPageDto(
    private var userService: UserService,
    private var mainService: MainService,
    private var facilityService: FacilityService
) {
    val userlist: List<UserEntities> = userService.getList()
    val crawllist: List<CrawlEntities> = mainService.getList()
    val ad_facility: List<FacilityEntities> = facilityService.get_AD_Facility()
}