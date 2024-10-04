package com.example.kopring.user.service

import com.example.kopring.facility.repository.FacilityEntities
import com.example.kopring.user.dto.UserInfoDto
import com.example.kopring.user.repository.UserEntities
import com.example.kopring.user.repository.UserRepository
import org.json.simple.JSONObject
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class UserService(var userRepository: UserRepository) {

    @Transactional(readOnly = true)
    fun getList(): List<UserEntities> = userRepository.findAll()

    fun idMatch(id: String): String{
        var jo: JSONObject = JSONObject()
     if(userRepository.existsById(id)){
         jo.put("result", "isNotValid")
         return jo.toString()
     }
        jo.put("result", "isValid")
        return jo.toString()
    }

    fun getUserInfo(id: String): UserInfoDto?{
        return userRepository.findById(id)
            .map{UserInfoDto.fromEntity(it)}
            .orElse(null)
    }

    fun userMatch(id: String, pw: String): Boolean = userRepository.existsByIdAndPw(id, pw)

}

