import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route } from "react-router-dom"
import './header.css'
import Login from "./login";
function Header() {
    const [isHovering, setIsHovering] = useState(false);
    const [auth, setAuth] = useState(false)
    useEffect(() => {
        axios.get("/auth")
    .then(response => {setAuth(response.data)
    })
    }, [])
    const mouseOver = () => {
        setIsHovering(true);
    }
    const mouseOut = () => {
        setIsHovering(false)
    }
    
  return (
    <div>
        <div className="nav">
            <div className="left-nav">
                <ul>
                    <li className={isHovering? "menu-1 slide" : "menu-1"} onMouseOver={mouseOver} onMouseOut={mouseOut}>소개
                        <ul className="side-menu">
                            <li>사이트 스토리</li>
                            <li>실버케어 플랫폼 소개</li>
                            <li>플랫폼 기술</li>
                        </ul>
                    </li>
                    <li>시설검색</li>
                    <li>정보</li>
                </ul>
            </div>
            <div className="center-nav">
                <h1>이미지</h1>   
            </div>
            <div className="right-nav">
                <ul>
                    <li className={isHovering? "menu-4 slide" : "menu-4"} onMouseOver={mouseOver} onMouseOut={mouseOut}>고객지원
                        <ul className="side-menu">
                            <li>자주묻는 질문</li>
                            <li>질문 게시판</li>
                            <li>1:1 문의</li>
                        </ul>
                    </li>
                    <li>회원가입</li>
                    {auth == false ? <li>로그인</li> : <li>로그아웃</li> }                      
                </ul>
            </div>        
        </div>
        {auth == false ? <Login/> : <div></div>}
    </div>
  );
}

export default Header;

