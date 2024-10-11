package com.example.kopring.user.dto

import com.example.kopring.user.entity.UserEntities

data class UserInfoDto (
    val id : String? = null,
    val name : String? = null,
    val email : String? = null,
    val address : String? = null,

){
    companion object {
        fun fromEntity(entities: UserEntities): UserInfoDto {
            return UserInfoDto(
                id = entities.id,
                name = entities.name,
                email = entities.email,
                address = entities.address,

            )
        }
    }
}