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
    const [replyWriteMode, setreplyWriteMode] = useState<boolean>(false)
    const [replyWriteModes, setReplyWriteModes] = useState<boolean[]>([]);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    const replyWriteContentRef = useRef<HTMLTextAreaElement | null>(null);
    const replyContentRef = useRef<HTMLTextAreaElement | null>(null);
    
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

    useEffect(() => {
        if (replys) {
            setReplyWriteModes(new Array(replys.length).fill(false));
        }

    }, [replys]);
    
    const writeData = async () => {
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
        await writeData()
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

    const writeReply = async (reply: ReplyDto | null, index: number | null) => {
        //alert("작성하시겠습니까 ?")
        let urlParams = new URLSearchParams(window.location.search)
        let postNo = parseInt(urlParams.get("post_id") as string)
        let lastReplyNo = (await axios.get("/api/reply_id_max")).data
        let replyData = {...reply};
        let newReplyData: ReplyDto

        if(index === null){
            newReplyData = {
                postNo: postNo,
                id: userId,
                replyRegDate: Date.now(),
                replyContent: replyWriteContentRef.current?.value,
                replyOrder: replys?.length ? replys.length + 1 : 1,
                replyId: lastReplyNo + 1,
                replyLike: 0
            }
            console.log("댓글 작성모드 :", newReplyData)
            await axios.post("/post/reply", newReplyData)
            alert("댓글이 작성되었습니다.")
        }else{
            console.log("댓글 정보 :", reply)
            replyData.replyContent = replyContentRef.current?.value
            console.log("댓글 수정모드 :", replyData)
            await axios.put("/post/reply", replyData)
            alert("댓글이 수정되었습니다.")
        }
        window.location.reload()
    }

    const modifyReply = (index : number) => {
        alert("수정하시겠습니까 ?")
        console.log("댓글 번호 :", index)
        setReplyWriteModes((prev) => {
            const writeModeArray = [...prev];
            writeModeArray[index] = true
            console.log(replyWriteModes)
            return writeModeArray
        })

        
    }
    
    const cancelReply = () => {
        alert("취소하시겠습니까 ?")
        setReplyWriteModes([])
    }
    const cancelTopReply = () => {
        alert("취소하시겠습니까 ?")
        setreplyWriteMode(false)
        window.location.reload()
    }

    const deleteReply = async(reply_id: number, e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault()
        if(window.confirm("댓글을 삭제하시겠습니까 ?")){
            await axios.delete('/post/reply', {params: {replyId: reply_id}})  
            alert("삭제되었습니다.")
            window.location.reload();
        }else{
            alert("취소되었습니다.")
            window.location.reload();
        }        
    }

    const recommendReply = () => {
        alert("댓글을 추천하시겠습니까 ?")
    }

    return(
        <div>
            <h1>질문게시판</h1>
                {writeMode || !post ? (<div className={postStyles.postWrapper}><div className={postStyles.postId}>작성자 : {userId}</div>
                <div className={postStyles.postTitle}>제목<input type="text" placeholder="제목을 입력하세요" ref={titleRef} defaultValue={post && post.postTitle}></input></div>
                <div className={postStyles.postContent}><textarea placeholder="내용을 입력하세요" ref={contentRef}>{post && post.postContent}</textarea></div>
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
                        writeMode ?
                        (<>
                            <div className={postStyles.postMenuBox} onClick={writePost}>작성</div>
                            <div className={postStyles.postMenuBox} onClick={deletePost}>삭제</div>
                        </>) : (<>
                            <div className={postStyles.postMenuBox} onClick={updatePost}>수정</div>
                            <div className={postStyles.postMenuBox} onClick={deletePost}>삭제</div>
                        </>)
                    ) : (<div></div>)
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
                        <textarea className={postStyles.replyWrite} ref={replyWriteContentRef} placeholder="댓글 내용을 작성하세요."></textarea>
                    </div>
                    <div className={postStyles.replyBottom}>
                        <ul className={postStyles.replyWritable}>
                            <li className={postStyles.replyMenu} onClick={() => writeReply(null, null)}>작성</li>
                            <li className={postStyles.replyMenu} onClick={cancelTopReply}>취소</li>
                        </ul>
                    </div> 
                    </div> ): <div></div>}
                                     
                    {post ? (post.replyList.map((item: ReplyDto, index: number) => (<div className={postStyles.replyBox}>
                        <div className={postStyles.replyTop} key={item.postNo}>
                            <ul>
                                <li>{item.id}</li>
                                <li>{item.replyRegDate}</li>
                                <li>👍 {item.replyLike}</li>
                            </ul>
                        </div>
                        {replyWriteModes[index] ? <div className={postStyles.replyMiddle}>
                                            <textarea className={postStyles.replyWrite} ref={replyContentRef} placeholder="댓글 내용을 작성하세요." defaultValue={item.replyContent}></textarea>
                                        </div> : 
                                        <div className={postStyles.replyMiddle}>
                                            {item.replyContent}
                                        </div>}
                        
                        <div className={postStyles.replyBottom}>
                            {item.id === userId? (<ul className={postStyles.replyWritable}>
                                { replyWriteModes[index] ? <li className={postStyles.replyMenu} onClick={() => writeReply(item, index)}>작성</li> : <li className={postStyles.replyMenu} onClick={() => modifyReply(index)}>수정</li>}
                                { replyWriteModes[index] ? <li className={postStyles.replyMenu} onClick={() => cancelReply()}>취소</li> : <li className={postStyles.replyMenu} onClick={(e: React.MouseEvent<HTMLLIElement>) => deleteReply(item.replyId, e)}>삭제</li>}
                                
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