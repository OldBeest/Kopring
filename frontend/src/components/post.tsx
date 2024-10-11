import React, { useRef } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import postStyles from '../styles/post.module.css'
import { Link } from "react-router-dom";

interface ReplyDto{
    postNo: number;
    id: string;
    replyDate: any;
    replyContent: string;
    replyOrder: number;
    
}

const getLastPostNum = async () =>{
    const response = await axios.get('/board')
    let lastPostNo = response.data.postDto[0].postNo
    return lastPostNo + 1
    
}

function Post(){
    const [post, setPost] = useState<any | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
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

    const checkData = async () => {
        const title = titleRef.current?.value;
        const content = contentRef.current?.value;

        if (!title || !content) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        let lastPostId = await getLastPostNum();
        console.log("요청 후 번호 + 1: ", lastPostId)
        let data = {
            postNo: lastPostId,
            id: "test아이디1",
            postTitle: title,
            postContent: content
        }; 
        
        await axios.post("/post", data)
        
    }

    async function writePost(){
        alert("작성하시겠습니까?")
        await checkData()
        window.location.href = "/board"
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

    return(
        <div>
            <h1>질문게시판</h1>
                {!post ? (<div className={postStyles.postWrapper}><div className={postStyles.postId}>작성자 : 없음</div>
                <div className={postStyles.postTitle}>제목<input type="text" placeholder="제목을 입력하세요" ref={titleRef}></input></div>
                <div className={postStyles.postContent}>내용<textarea placeholder="내용을 입력하세요" ref={contentRef}></textarea></div>
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
                    <Link to={!post? "/board/create": "/board/update"} onClick={!post? writePost: updatePost}><div className={postStyles.postMenuBox}>{!post? "작성" : "수정"}</div></Link>
                    <Link to="/board/delete"><div className={postStyles.postMenuBox} onClick={deletePost}>삭제</div></Link>
                    <Link to="/board"><div className={postStyles.postMenuBox}>취소</div></Link>
                </div>
                <div className="replyWrapper">
                    <div>
                        <ul>
                            <li>작성자</li>
                            <li>작성일</li>
                        </ul>
                    </div>
                    <div className="replyMiddle">
                        <textarea>댓글 내용을 작성하세요</textarea>
                    </div>
                    <div className="replyBottom">
                        <ul className={postStyles.replyWritable}>
                            <li><button>작성</button></li>
                            <li><button>취소</button></li>
                        </ul>
                    </div>  
                    {post ? (post.replylist.map((item: ReplyDto) => (<div>
                        <div className="replyTop" key={item.postNo}>
                            <ul>
                                <li>{item.id}</li>
                                <li>{item.replyDate}</li>
                            </ul>
                        </div>
                        <div className="replyMiddle">
                            {item.replyContent}
                        </div>
                        <div className="replyBottom">
                            {item.id == "test1" ? (<ul className={postStyles.replyWritable}>
                                <li>수정</li>
                                <li>삭제</li>
                            </ul>) : (<ul className={postStyles.replyWritable}>
                            </ul>)}
                        </div>
                    </div>)))
                    : <div>댓글 로딩중...</div>}
                </div>
            </div>
         

    );
}

export default Post;