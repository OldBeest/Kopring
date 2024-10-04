import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import postStyles from '../styles/post.module.css'
import { Link } from "react-router-dom";


function writePost(){
    alert("작성하시겠습니까?")
    const getLastPostNum = async() =>{
        const response = await axios.get('/board')
        let lastPostNo = response.data.postDto[0].postNo
        console.log(lastPostNo)
        console.log(new Date().getTime())
    }
    getLastPostNum();
    // window.location.href = "/board";
}

function updatePost(){
    alert("수정하시겠습니까?")
}

function deletePost(){
    if(window.confirm("삭제하시겠습니까?")){
        alert("삭제되었습니다.")
        window.location.href = "/board"
    }else{
        alert("취소되었습니다.")
        window.location.reload();
    }
}

function Post(){
    const [post, setPost] = useState<any | null>([]);
    useEffect(()=>{
        async function getPost() {
            try{
            const url = new URL(window.location.href).searchParams
            if(url.size === 0){
                console.log("post :", post)

            }else{
                const post_id = url.get("post_id")
                const response = await axios.get('/post/' + post_id)
                setPost(response.data)
            }
        }catch(error){
            console.log(error)
        }
    }
    getPost();    
    }, []);
    return(
        <div>
            <h1>질문게시판</h1>
                {post.length < 1 ? (<div className={postStyles.postWrapper}><div className={postStyles.postId}>작성자 : 없음</div>
                <div className={postStyles.postTitle}>제목<input type="text" placeholder="제목을 입력하세요"></input></div>
                <div className={postStyles.postContent}>내용<textarea placeholder="내용을 입력하세요" ></textarea></div>
                <div className={postStyles.attachList}>
                    <div style={{display: "flex"}}>
                        <div>첨부 :</div>
                        <div>&nbsp;없음<button>추가하기</button></div>
                    </div>
                </div></div>): (<div className={postStyles.postWrapper}><div className={postStyles.postId}>작성자 : {post.id}</div>
                <div className={postStyles.postTitle}>제목 : {post.postTitle}</div>
                <div className={postStyles.postContent}>내용 : {post.postContent}</div>
                <div className={postStyles.attachList}>
                    <div style={{display: "flex"}}>
                        <div>첨부 :</div>
                        <div>&nbsp;{post.postFile}</div>
                    </div>
                </div></div>)}
                <div className={postStyles.postMenu}>
                    <Link to={post.length < 1? "/board/create": "/board/update"} onClick={post.length < 1? writePost: updatePost}><div className={postStyles.postMenuBox}>{post.length < 1 ? "작성" : "수정"}</div></Link>
                    <Link to="/board/delete"><div className={postStyles.postMenuBox} onClick={deletePost}>삭제</div></Link>
                    <Link to="/board"><div className={postStyles.postMenuBox}>취소</div></Link>
                </div>
            </div>
         

    );
}

export default Post;