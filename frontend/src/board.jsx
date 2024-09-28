import React, { useEffect, useState } from "react";
import axios from "axios";
import boardStyles from './board.module.css'
function Board() {
    const [boardList, setboardList] = useState([]);
    useEffect(() =>{
        axios.get('/board')
        .then(response => {setboardList(response.data)
            console.log("board0 :", boardList)
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
                <div className={boardStyles.noticeBoard}>
                    공지사항 입력
                </div>
                <div className={boardStyles.contentBoard}>
                    <ul className={boardStyles.list}>
                        <li style={{width: "5%"}}>{boardList[26].post_no}</li>
                        <li style={{width: "40%"}}>{boardList[26].post_title}</li>
                        <li style={{width: "10%"}}>{boardList[26].id}</li>
                        <li style={{width: "15%"}}>{boardList[26].post_reg_date}</li>
                        <li style={{width: "5%"}}>{boardList[26].post_hit}</li>
                    </ul>
                </div>
                <div className={boardStyles.boardMenu}>
                    게시판 메뉴
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