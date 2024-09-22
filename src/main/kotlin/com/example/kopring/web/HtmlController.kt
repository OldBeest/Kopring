package com.example.kopring.web

import com.example.kopring.user.repository.UserEntities
import com.example.kopring.user.repository.UserRepository
import com.example.kopring.user.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.ui.set
import org.springframework.web.bind.annotation.GetMapping

@Controller
class HtmlController {

    private var userService: UserService? = null

    @GetMapping("/")
    fun home(model: Model): String {
        model["title"] = "Kotlin"
        val list: List<UserEntities>? = userService?.getList()
        println("list : ${list}")
        return "kotlin"
    }
}