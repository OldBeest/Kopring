import React from 'react';
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
}

interface NoticeDto{
    post_id: string;
    noticeTitle: string;
    noticeRegDate: string;
    noticeHit: number;

}

interface PostList{
    noticeDto: NoticeDto[];
    postDto: PostDto[];
}

function Board() {
    const [postList, setPostList] = useState<PostList>({noticeDto: [], postDto: []}); // 게시판 데이터(공지, 일반 게시물)
    const [counts, setCounts] = useState<number>(1); // 일반 게시물 개수
    const [pages, setPages] = useState<number>(0); // 필요한 총 페이지
    const [postsPerPage, setPostsPerPage] = useState<number>(5); //한 페이지당 게시물 개수
    const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
    const [select, setSelect] = useState<string>(""); //옵션 기능
    
    useEffect(() =>{

        const fetchBoard = async() => {
            const response = await axios.get<PostList>('/board')
            const data = response.data

            setPostList(data)
            setCounts(data.postDto.length)
            setPages(Math.ceil(data.postDto.length / postsPerPage))      
        }   
        
        fetchBoard();

    }, [postsPerPage]);
    
    const firstPageIdx = (currentPage - 1) * postsPerPage
    const lastPageIdx = firstPageIdx + postsPerPage
    const currentPosts = postList.postDto.slice(firstPageIdx, lastPageIdx)

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

    return (
        <div>
            <h1>질문게시판(페이지네이션1)</h1>
            <h1>전체 테이블을 가져온 후 페이지네이션 진행</h1>   
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
                        {currentPosts.map((item) => (<ul className={boardStyles.list} key={item.postNo}>
                            <li style={{width: "5%"}}>{item.postNo}</li>
                            <li style={{width: "40%"}}><Link to={"/post?post_id=" + item.postNo}>{item.postTitle}</Link></li>
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
                            <input type="text"></input><button>검색하기</button>
                            <ul>
                                <Link to='/post'><li>글쓰기</li></Link>
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
                                <li onClick={goFirst}>처음</li>
                                <li onClick={goPrevious}>이전</li>
                                {[...Array(pages)].map((_, index) => (<li key={index + 1} onClick={() => {goPage(index + 1)}}><span className={currentPage === index + 1? boardStyles.active: ''}>{index + 1}</span></li>))}         
                                <li onClick={goNext}>다음</li>
                                <li onClick={goLast}>마지막</li>
                                <li></li>
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

