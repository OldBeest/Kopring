import React, { useRef } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import postStyles from '../styles/post.module.css'
import { Link } from "react-router-dom";

interface ReplyDto{
    postNo: number;
    id: string;
    replyRegDate: any;
    replyContent: string | undefined;
    replyOrder: number;
    replyId: number;
    replyLike: number;
    
}

const getLastPostNum = async () => {
    const response = await axios.get('/board')
    let lastPostNo = response.data.postDto[0].postNo
    return lastPostNo + 1
    
}

function Post(){
    const [post, setPost] = useState<any | null>(null);
    const [replys, setReplys] = useState<ReplyDto[]>();
    const [userId, setUserId] = useState<string>("")
    const [writeMode, setwriteMode] = useState<boolean>(false)
    const titleRef = useRef<HTMLInputElement | null>(null);
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    const replyRef = useRef<HTMLTextAreaElement | null>(null);
    
    useEffect(()=>{
        async function getPost() {
            try{
            const url = new URL(window.location.href).searchParams
            if(url.size === 0){
                console.log("post :", post)
                const responseId = await axios.post("/auth/get_userid", null, {
                    headers:{ Authorization: `Bearer ${localStorage.getItem("access-token")}`},
                    withCredentials: true,
                  })
                  setUserId(responseId.data)
                  console.log("아이디 :", responseId.data)

            }else{
                const post_id = url.get("post_id")
                const response = await axios.get('/post/' + post_id)
                const responseId = await axios.post("/auth/get_userid", null, {
                    headers:{ Authorization: `Bearer ${localStorage.getItem("access-token")}`},
                    withCredentials: true,
                  })
                setPost(response.data)
                setReplys(response.data.replyList)
                setUserId(responseId.data)
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
            alert("제목과 내용을 모두 입력해주세요.");
            return window.location.reload()
        }
        let data;
        if (writeMode && post){
            data = {
                postNo: post.postNo,
                id: userId ? userId : "null",
                postRegDate: post.postRegDate,
                postTitle: title,
                postContent: content,
                postHit: post.postHit

            }
            await axios.put("/post", data)
        } else {
            let lastPostId = await getLastPostNum();
            data = {
                postNo: lastPostId,
                id: userId ? userId : "null",
                postRegDate: Date.now(),
                postTitle: title,
                postContent: content,
                postHit: 0

            }
            await axios.post("/post", data)
        }
        window.location.href = "/board"
    }

    async function writePost(){
        alert("작성하시겠습니까 ?")
        await checkData()
        window.location.href = "/board"        
    }
    
    function updatePost(){
        alert("수정하시겠습니까 ?")
        setwriteMode(true)
    }
    
    async function deletePost(){
        if(window.confirm("삭제하시겠습니까 ?")){
            let urlParams = new URLSearchParams(window.location.search)
            let postNo = urlParams.get("post_id")
            await axios.delete('/post', {params: {postNo: postNo}})  
            alert("삭제되었습니다.")
            window.location.href = "/board"
        }else{
            alert("취소되었습니다.")
            window.location.reload();
        }
    }

    const writeReply = async() => {
        //alert("작성하시겠습니까 ?")
        let urlParams = new URLSearchParams(window.location.search)
        let postNo = parseInt(urlParams.get("post_id") as string)
        let lastReplyNo = (await axios.get("/api/reply_id_max")).data
        console.log(replys)
        let replyDto: ReplyDto = {
            
            postNo: postNo,
            id: userId,
            replyRegDate: Date.now(),
            replyContent: document.querySelector("textarea")?.value,
            replyOrder: replys?.length ? replys.length + 1 : 1,
            replyId: lastReplyNo + 1,
            replyLike: 0

        }
        await axios.post("/post/reply", replyDto)
        window.location.reload()
    }

    const modifyReply = () => {
        alert("수정하시겠습니까 ?")
    }
    
    const cancelReply = () => {
        alert("취소하시겠습니까 ?")
    }

    const deleteReply = () => {
        alert("삭제하시겠습니까 ?")        
    }

    const recommendReply = () => {
        alert("댓글을 추천하시겠습니까 ?")
    }

    return(
        <div>
            <h1>질문게시판</h1>
                {writeMode || !post ? (<div className={postStyles.postWrapper}><div className={postStyles.postId}>작성자 : {userId}</div>
                <div className={postStyles.postTitle}>제목<input type="text" placeholder="제목을 입력하세요" ref={titleRef}></input></div>
                <div className={postStyles.postContent}><textarea placeholder="내용을 입력하세요" ref={contentRef}></textarea></div>
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
                    {post && post.id === userId ? (
                        <>
                            <div className={postStyles.postMenuBox} onClick={updatePost}>수정</div>
                            <div className={postStyles.postMenuBox} onClick={deletePost}>삭제</div>
                        </>
                    ) : (<div className={postStyles.postMenuBox} onClick={writePost}>작성</div>)
                    }
                    <Link to="/board">
                        <div className={postStyles.postMenuBox}>돌아가기</div>
                    </Link>
                </div>
                <div className={postStyles.replyWrapper}>
                    {userId ? (<div className={postStyles.replyBox}>
                    <div className={postStyles.replyTop}>
                        <ul>
                            <li>{userId}</li>
                            <li>{new Date().toLocaleString()}</li>
                        </ul>
                    </div>
                    <div className={postStyles.replyMiddle}>
                        <textarea className={postStyles.replyWrite} placeholder="댓글 내용을 작성하세요."></textarea>
                    </div>
                    <div className={postStyles.replyBottom}>
                        <ul className={postStyles.replyWritable}>
                            <li className={postStyles.replyMenu} onClick={writeReply}>작성</li>
                            <li className={postStyles.replyMenu} onClick={cancelReply}>취소</li>
                        </ul>
                    </div> 
                    </div> ): <div></div>}
                                     
                    {post ? (post.replyList.map((item: ReplyDto) => (<div className={postStyles.replyBox}>
                        <div className={postStyles.replyTop} key={item.postNo}>
                            <ul>
                                <li>{item.id}</li>
                                <li>{item.replyRegDate}</li>
                                <li>👍 {item.replyLike}</li>
                            </ul>
                        </div>
                        <div className={postStyles.replyMiddle}>
                            {item.replyContent}
                        </div>
                        <div className={postStyles.replyBottom}>
                            {item.id === userId? (<ul className={postStyles.replyWritable}>
                                <li className={postStyles.replyMenu} onClick={modifyReply}>수정</li>
                                {/* <li className={postStyles.replyMenu} onClick={cancelReply}>취소</li> */}
                                <li className={postStyles.replyMenu} onClick={deleteReply}>삭제</li>
                            </ul>) : (<ul className={postStyles.replyNonWritable}>
                                <li className={postStyles.replyMenu} onClick={recommendReply}>👍 추천하기</li>
                            </ul>)}
                        </div>
                    </div>)))
                    : <div></div>}
                    <div className={postStyles.replyMore}> 댓글 더보기</div>
                </div>
            </div>
         

    );
}

export default Post;