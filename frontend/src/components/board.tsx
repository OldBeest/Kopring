import React, { useEffect, useState } from "react";
import axios from "axios";
import boardStyles from '../styles/board.module.css';

function Board() {
    const [boardList, setboardList] = useState<any | null>([]); // 게시판 데이터(공지, 일반 게시물)
    const [postMax, setPostMax] = useState<number>(10); //한 화면에 등록 개수(5, 10, 20)
    const [lists, setLists] = useState<number | null>(null); // 일반 게시물 개수 
    const [limit, setLimit] = useState<number>(5); // 페이징 단위(5, 10)
    const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
    const [counts, setCounts] = useState<number>(1); // 일반 게시물 개수
    const [pages, setPages] = useState<number>(0); // 필요한 페이지
    const [pageArr, setPageArr] = useState<Array<number> | null>([]); // 페이징 번호를 담는 배열
    const [select, setSelect] = useState<string>(""); //옵션 기능

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
        const CreateArr = (pages: number) => {
            let arr = new Array(pages).fill(0)
            for(let i=0; i<arr.length; i++){
                arr[i] = i + 1;
            }
            return arr
            
        }
        fetchBoard();
    }, [lists, pages]);
    
    //첫 페이지
    function goFirst(){

    }
    //마지막 페이지
    function goLast(){
        
    }
    //이전 페이지
    function goPrevious(){
        
    }
    //다음 페이지
    function goNext(){
        
    }
    //특정 페이지
    function goPageNum(){
        
    }
    //게시글 표시 단위
    function changePostMax(event: any){
        setSelect(event.target.value)
        setPostMax(event.target.value)
        setLimit(event.target.value)
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
                    {boardList.noticeDto && boardList.noticeDto.length > 0 ? <div className={boardStyles.noticeBoard}>
                        {boardList.noticeDto.map((item: any) => {return <ul className={boardStyles.list} key={item.post_id}>
                                <li style={{width: "5%"}}>공지</li>
                                <li style={{width: "40%"}}>{item.noticeTitle}</li>
                                <li style={{width: "10%"}}>관리자</li>
                                <li style={{width: "15%"}}>{item.noticeRegDate}</li>
                                <li style={{width: "5%"}}>{item.noticeHit}</li>
                            </ul>;})}
                        </div> : <div>데이터 로딩중...</div>}
                    {boardList.postDto && boardList.postDto.length > 0 ? <div className={boardStyles.contentBoard}>
                        {boardList.postDto.map((item: any, index: number) => {if(index < postMax)return <ul className={boardStyles.list} key={item.postNo}>
                            <li style={{width: "5%"}}>{item.postNo}</li>
                            <li style={{width: "40%"}}>{item.postTitle}</li>
                            <li style={{width: "10%"}}>{item.id}</li>
                            <li style={{width: "15%"}}>{item.postRegDate}</li>
                            <li style={{width: "5%"}}>{item.postHit}</li>
                        </ul>;})}
                    </div> : <div>데이터 로딩중...</div>}
                                    
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
                                <a href="/post"><li>글쓰기</li></a>
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

