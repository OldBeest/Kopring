import React, { useEffect, useState } from "react";
import axios from "axios";
import boardStyles from './board.module.css'

function Board() {
    const [postMax, setPostMax] = useState(10);
    const [boardList, setboardList] = useState([]);
    const [lists, setLists] = useState([]);
    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [counts, setCounts] = useState(1); 
    const [pages, setPages] = useState(0);
    const [pageArr, setPageArr] = useState([]);

    useEffect(() =>{
        async function fetchBoard() {
            try{
            const response = await axios.get('/board')            
            setboardList(response.data)
            setLists(response.data.postDto.length)
            setCounts(response.data.postDto.length)
            setPages(Math.ceil(response.data.postDto.length/limit))
            setPageArr(CreateArr(pages))            
        }catch(error){
            console.log(error)
        }
    }   
        const CreateArr = (pages) => {
            let arr = new Array(pages).fill(0)
            for(let i=0; i<arr.length; i++){
                arr[i] = i + 1;
            }
            return arr
            
        }
        fetchBoard();
    }, []);
    
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
                    {boardList.noticeDto && boardList.noticeDto.length > 0 ? <div className={boardStyles.noticeBoard}>
                        {boardList.noticeDto.map((item) => {return <ul className={boardStyles.list} key={item.post_id}>
                                <li style={{width: "5%"}}>공지</li>
                                <li style={{width: "40%"}}>{item.noticeTitle}</li>
                                <li style={{width: "10%"}}>관리자</li>
                                <li style={{width: "15%"}}>{item.noticeRegDate}</li>
                                <li style={{width: "5%"}}>{item.noticeHit}</li>
                            </ul>;})}
                        </div> : <div>데이터 로딩중...</div>}
                    {boardList.postDto && boardList.postDto.length > 0 ? <div className={boardStyles.contentBoard}>
                        {boardList.postDto.map((item, index) => {if(index < postMax)return <ul className={boardStyles.list} key={item.postNo}>
                            <li style={{width: "5%"}}>{item.postNo}</li>
                            <li style={{width: "40%"}}>{item.postTitle}</li>
                            <li style={{width: "10%"}}>{item.id}</li>
                            <li style={{width: "15%"}}>{item.postRegDate}</li>
                            <li style={{width: "5%"}}>{item.postHit}</li>
                        </ul>;})}
                    </div> : <div>데이터 로딩중...</div>}
                                    
                    <div className={boardStyles.boardMenu}>
                        <div style={{display: "flex", justifyContent: "right"}}>
                            <input type="text"></input><button>검색하기</button>
                            <ul>
                                <li>글쓰기</li>                        
                            </ul>
                        </div>
                    </div>
                    <div className={boardStyles.paging}>
                    <div>
                        <div>
                            <ul>             
                                <li>리스트 개수 : {lists}</li>
                                <li>페이지당 게시글 수: {limit}</li>
                                <li>현재 페이지 : {currentPage}</li>
                                <li>게시글 개수 : {counts}</li>
                                <li>총 페이지 : {pages}</li>
                            </ul>
                        </div>
                        <div>
                            <div>
                                <li>처음</li>
                                <li>이전</li>
                                {pageArr && pageArr.length > 0? pageArr.map((num) => {if(num <= limit + 1) return <li>{num}</li>}): <li>데이터 준비중...</li>}              
                                <li>다음</li>
                                <li>마지막</li>
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

