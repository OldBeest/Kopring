package com.example.kopring.service

import com.example.kopring.board.dto.PostDto
import com.example.kopring.board.service.PostService
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional
import java.sql.Date
import java.sql.Timestamp
import java.time.LocalDateTime
import kotlin.test.assertEquals

@SpringBootTest
@Transactional
class PostServiceIntegrationTest(@Autowired val postService: PostService) {

    //test case는 field 주입으로 해도 상관없음

    @Test
    fun writeTest(){
        //given
        val postDto = PostDto(
            postNo = 134,
            id = "testid",
            postTitle = "TestTitle",
            postContent = "TestContent",
            postGroup = 134,
            postStep = 0,
            postIndent = 0,
            postHit = 0,
            postRegDate = Timestamp.valueOf(LocalDateTime.now()),
            postFile = "",
            isNotice = 0,
            )

        //when
        postService.createPost(postDto)
        val result = postService.getPost(postDto.postNo)

        //then
        assertEquals(result?.id, postDto.id)

    }
}