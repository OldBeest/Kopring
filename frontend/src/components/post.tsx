import React from "react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import postStyles from '../styles/post.module.css'

function Post(){
    const [post, setPost] = useState<any | null>([]);
    useEffect(()=>{
        async function fetchPost() {
            try{
            const response = await axios.get('/post', {params:{post_id: 93}})            
            setPost(response.data)
        }catch(error){
            console.log(error)
        }
    }  
    fetchPost();    
    }, [post]);
    return(
        <div>
            <h1>질문게시판</h1>
            <div className={postStyles.postWrapper}>
                <div className={postStyles.postId}>작성자 : {post.id}</div>
                <div className={postStyles.postTitle}>제목 : {post.postTitle}</div>
                <div className={postStyles.postContent}>내용 : {post.postContent}</div>
                <div className={postStyles.attachList}>
                    <div style={{display: "flex"}}>
                        <div>첨부 :</div>
                        <div>&nbsp;{post.postFile}</div>
                    </div>
                </div>
                <div className={postStyles.postMenu}>
                    <div className={postStyles.postMenuBox}>수정</div>
                    <div className={postStyles.postMenuBox}>삭제</div>
                    <div className={postStyles.postMenuBox}>취소</div>
                </div>
            </div>
        </div>
         

    );
}

export default Post;