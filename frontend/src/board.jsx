import React, { useEffect, useState } from "react";
import axios from "axios";
import boardStyles from './board.module.css'
function Board() {
    const [boardList, setboardList] = useState([]);
    useEffect(() =>{
        axios.get('/board')
        .then(response => {setboardList(response.data)    
        })
        .catch(error => console.log(error))
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
                        {boardList.noticeDto.map((item) => {return <ul className={boardStyles.list} key={item.post_no}>
                                <li style={{width: "5%"}}>공지</li>
                                <li style={{width: "40%"}}>{item.notice_title}</li>
                                <li style={{width: "10%"}}>관리자</li>
                                <li style={{width: "15%"}}>{item.notice_reg_date}</li>
                                <li style={{width: "5%"}}>{item.notice_hit}</li>
                            </ul>;})}
                        </div> : <div>데이터 로딩중...</div>}
                    {boardList.postDto && boardList.postDto.length > 0 ? <div className={boardStyles.contentBoard}>
                        {boardList.postDto.map((item) => {return <ul className={boardStyles.list} key={item.post_no}>
                            <li style={{width: "5%"}}>{item.post_no}</li>
                            <li style={{width: "40%"}}>{item.post_title}</li>
                            <li style={{width: "10%"}}>{item.id}</li>
                            <li style={{width: "15%"}}>{item.post_reg_date}</li>
                            <li style={{width: "5%"}}>{item.post_hit}</li>
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
                        하단 페이징
                    </div>
                </div>
            </div>
        </div>
      );
}

export default Board;