import React, { useRef } from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import boardStyles from '../styles/board.module.css';
import { Link } from 'react-router-dom'

interface PostDto{
    postNo: number;
    postTitle: string;
    id: string;
    postRegDate: string;
    postHit: number;
    replyCount: number;
}

interface NoticeDto{
    post_id: string;
    noticeTitle: string;
    noticeRegDate: string;
    noticeHit: number;
}

interface ReplyCountDto{
    postNo: number;
    count: number;
}

interface PostList{
    noticeDto: NoticeDto[];
    postDto: PostDto[];
    replyCountList: ReplyCountDto[]
}

function Board() {
    const [postList, setPostList] = useState<PostList>({noticeDto: [], postDto: [], replyCountList: []}); // 게시판 데이터(공지, 일반 게시물)
    const [counts, setCounts] = useState<number>(1); // 일반 게시물 개수
    const [pages, setPages] = useState<number>(0); // 필요한 총 페이지
    const [postsPerPage, setPostsPerPage] = useState<number>(5); //한 페이지당 게시물 개수
    const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
    const [select, setSelect] = useState<string>(""); //옵션 기능
    const [isLogin, setIsLogin] = useState<string>("")
    const [searchType, setSearchType] = useState<string>("title")
    const searchContent = useRef<HTMLInputElement | null>(null)

    
    const fetchBoard = async() => {
        try{
            const response = await axios.get<PostList>('/board')
            const data = response.data

            setPostList(data)
            setCounts(data.postDto.length)
            setPages(Math.ceil(data.postDto.length / postsPerPage))
            console.log("보드 페이지 응답",data)  
        } catch(error){
            console.error("데이터를 가져오는 중 오류 발생", error)
        }
            
    }
    const checkLogin = async () => {
        const responseId = await axios.post("/auth/get_userid", null, {
            headers:{ Authorization: `Bearer ${localStorage.getItem("access-token")}`},
            withCredentials: true,
          })
          
        setIsLogin(responseId.data)
    }  

    const newFetch = async (type: string) => {
        let value = searchContent.current?.value
        const response = await axios.get("/board",{params: {category: type, value: value}})
        console.log("뉴 패치 응답 :",response.data)
        setPostList(response.data)
        setCounts(response.data.postDto.length)
        setPages(Math.ceil(response.data.postDto.length / postsPerPage))
    }

    useEffect(() =>{                 
        fetchBoard();
        checkLogin();
        
    }, [postsPerPage]);
    
    const firstPageIdx = (currentPage - 1) * postsPerPage
    const lastPageIdx = firstPageIdx + postsPerPage
    const replyCounts = postList.replyCountList.slice(firstPageIdx, lastPageIdx)
    const currentPosts = postList.postDto.slice(firstPageIdx, lastPageIdx)
    
    const postsWithCounts = currentPosts.map(post => {
        const replyCount = replyCounts.find(reply => reply.postNo === post.postNo);

        return {
            ...post,
            replyCount: replyCount ? replyCount.count : 0
        };
    });
    

    // 페이지 이동
    const goPage = (pageNum: number) => {setCurrentPage(pageNum)}
    const goFirst = () => goPage(1)
    const goLast = () => goPage(pages)
    const goPrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1)
    const goNext = () => currentPage < pages && setCurrentPage(currentPage + 1)
    
    //게시글 표시 단위 페이지
    function changePostMax(event: React.ChangeEvent<HTMLSelectElement>){
        let newPostsPerPage: number = +event.target.value
        setSelect(event.target.value)
        setPostsPerPage(newPostsPerPage)
        setCurrentPage(1)
    }

    function changeSearchType(event: React.ChangeEvent<HTMLSelectElement>){
        let newSearchType: string = event.target.value.toString()
        setSearchType(newSearchType)
    }

    return (
        <div>
            <h1>질문게시판</h1>
            <div className={boardStyles.boardWrapper}>
                <div>
                    <div className={boardStyles.boardTop}>
                        <ul className={boardStyles.list}>
                            <li style={{width: "5%"}}>번호</li>
                            <li style={{width: "40%"}}>제목</li>
                            <li style={{width: "10%"}}>작성자</li>
                            <li style={{width: "15%"}}>작성일</li>
                            <li style={{width: "5%"}}>조회수</li>
                        </ul>
                    </div>
                    {postList.noticeDto.length > 0 ? <div className={boardStyles.noticeBoard}>
                        {postList.noticeDto.map((item) => {return <ul className={boardStyles.list} key={item.post_id}>
                                <li style={{width: "5%"}}>공지</li>
                                <li style={{width: "40%"}}>{item.noticeTitle}</li>
                                <li style={{width: "10%"}}>관리자</li>
                                <li style={{width: "15%"}}>{item.noticeRegDate}</li>
                                <li style={{width: "5%"}}>{item.noticeHit}</li>
                            </ul>;})}
                        </div> : <div>데이터 로딩중...</div>}
                    {currentPosts.length > 0 ?( 
                        <div className={boardStyles.contentBoard}>
                        {postsWithCounts.map((item) => (<ul className={boardStyles.list} key={item.postNo}>
                            <li style={{width: "5%"}}>{item.postNo}</li>
                            <li style={{width: "40%"}}><Link to={"/post?post_id=" + item.postNo}>{item.postTitle} {item.replyCount != 0 ? `[${item.replyCount}]` : ""}</Link></li>
                            <li style={{width: "10%"}}>{item.id}</li>
                            <li style={{width: "15%"}}>{item.postRegDate}</li>
                            <li style={{width: "5%"}}>{item.postHit}</li>
                        </ul>))}
                    </div>) : <div>데이터 로딩중...</div>}
                                    
                    <div className={boardStyles.boardMenu}>
                        <div style={{display: "flex", justifyContent: "right"}}>
                            <div>
                                <label htmlFor="postSelect">게시글 개수 선택</label>
                                <select className="postSelect" onChange={changePostMax} value={select}>
                                    <option value={5}>5개씩 보기</option>
                                    <option value={10}>10개씩 보기</option>
                                    <option value={20}>20개씩 보기</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="searchSelect"></label>
                                <select className="searchSelect" onChange={changeSearchType} value={searchType}>
                                    <option value="title" >제목</option>
                                    <option value="id">작성자</option>
                                    <option value="content">내용</option>
                                    <option value="titleAndcontent">제목+내용</option>
                                </select>
                                <input type="text"  ref={searchContent}></input><button onClick={() => newFetch(searchType)}>검색하기</button>
                            </div>
                            <ul>
                                {isLogin ? (<Link to="/post"><li >글쓰기</li></Link>) : <li></li>}
                            </ul>
                        </div>
                    </div>
                    <div className={boardStyles.paging}>
                    <div>
                        <div>
                            <ul>             
                                <li>페이지당 게시글 수: {postsPerPage}</li>
                                <li>현재 페이지 : {currentPage}</li>
                                <li>게시글 개수 : {counts}</li>
                                <li>총 페이지 : {pages}</li>
                            </ul>
                        </div>
                        <div>
                            <div>
                                <ul>
                                    <li className={boardStyles.pagingBox} onClick={goFirst}>처음</li>
                                    <li className={boardStyles.pagingBox} onClick={goPrevious}>이전</li>
                                    {[...Array(pages)].map((_, index) => (<li key={index + 1} className={boardStyles.pagingBox} onClick={() => {goPage(index + 1)}}><span className={currentPage === index + 1? boardStyles.active: ''}>{index + 1}</span></li>))}         
                                    <li className={boardStyles.pagingBox} onClick={goNext}>다음</li>
                                    <li className={boardStyles.pagingBox} onClick={goLast}>마지막</li>
                                    <li></li>
                                </ul>
                            </div>
                        </div>
                    </div> 
                    </div>
                </div>
            </div>
        </div>
      );
}

export default Board;

