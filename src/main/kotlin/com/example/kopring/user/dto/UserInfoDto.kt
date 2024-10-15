package com.example.kopring.user.dto

import com.example.kopring.user.entity.UserEntities
import java.sql.Timestamp
import java.time.LocalDateTime

data class UserInfoDto (
    val id : String? = null,
    val name : String? = null,
    val pw : String? = null,
    val email : String? = null,
    val birthDate : Timestamp? = null,
    val phone : String? = null,
    val autoLoginToken : String? = null,
    val temppw : String? = null,
    val gender : String? = null,
    val joinDate : Timestamp? = null,
    val disease : String? = null,
    val feature : String? = null,
    val address : String? = null,

){
    fun toEntity(userInfoDto: UserInfoDto): UserEntities{

        return UserEntities().apply {
            id = userInfoDto.id
            name = userInfoDto.name
            pw = userInfoDto.pw
            email = userInfoDto.email
            birthDate = userInfoDto.birthDate
            phone = userInfoDto.phone
            autoLoginToken = userInfoDto.autoLoginToken
            temppw = userInfoDto.temppw
            gender = userInfoDto.gender
            joinDate = Timestamp.valueOf(LocalDateTime.now())
            disease = userInfoDto.disease
            feature = userInfoDto.feature
            address = userInfoDto.address

        }
    }
    companion object {
        fun fromEntity(entities: UserEntities): UserInfoDto {
            return UserInfoDto(
                id = entities.id,
                name = entities.name,
                pw = entities.pw,
                email = entities.email,
                birthDate = entities.birthDate,
                phone = entities.phone,
                autoLoginToken = entities.autoLoginToken,
                temppw = entities.temppw,
                gender = entities.gender,
                joinDate = entities.joinDate,
                disease = entities.disease,
                feature = entities.feature,
                address = entities.address,

            )
        }
    }
}