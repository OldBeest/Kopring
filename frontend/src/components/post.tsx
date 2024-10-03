import React from "react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import postStyles from '../styles/post.module.css'
import { Link } from "react-router-dom";

function Post(){
    const [post, setPost] = useState<any | null>([]);
    useEffect(()=>{
        async function fetchPost() {
            try{
            const url = new URL(window.location.href).searchParams
            const post_id = url.get("post_id")
            const response = await axios.get('/post/' + post_id)
            setPost(response.data)
        }catch(error){
            console.log(error)
        }
    }  
    fetchPost();    
    }, []);
    return(
        <div>
            <h1>질문게시판</h1>
            <div className={postStyles.postWrapper}>
                {!post ? (<div><div className={postStyles.postId}>작성자 : 없음</div>
                <div className={postStyles.postTitle}>제목<input type="text" placeholder="제목을 입력하세요"></input></div>
                <div className={postStyles.postContent}>내용<input type="textarea" placeholder="제목을 입력하세요"></input></div>
                <div className={postStyles.attachList}>
                    <div style={{display: "flex"}}>
                        <div>첨부 :</div>
                        <div>&nbsp;없음<button>추가하기</button></div>
                    </div>
                </div></div>): (<div><div className={postStyles.postId}>작성자 : {post.id}</div>
                <div className={postStyles.postTitle}>제목 : {post.postTitle}</div>
                <div className={postStyles.postContent}>내용 : {post.postContent}</div>
                <div className={postStyles.attachList}>
                    <div style={{display: "flex"}}>
                        <div>첨부 :</div>
                        <div>&nbsp;{post.postFile}</div>
                    </div>
                </div></div>)}
                <div className={postStyles.postMenu}>
                    <div className={postStyles.postMenuBox}>수정</div>
                    <Link to="/board/delete"><div className={postStyles.postMenuBox}>삭제</div></Link>
                    <Link to="/board"><div className={postStyles.postMenuBox}>취소</div></Link>
                </div>
            </div>
        </div>
         

    );
}

export default Post;