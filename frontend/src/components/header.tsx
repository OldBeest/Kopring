import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import '../styles/header.css'

function Header() {
    const [isHovering, setIsHovering] = useState(false);
    const [auth, setAuth] = useState(false)
    const [isLogin, setIsLogin] = useState(false)

    useEffect(() => {
        
        const check_auth = async () => {
                try{
                    const response = await axios.post("/auth/check_token", null, {
                        headers:{ Authorization: `Bearer ${localStorage.getItem("access-token")}`},
                        withCredentials: true, // 이 옵션을 설정하여 쿠키와 인증 정보를 함께 보냄
                      })
                      console.log("from access response :", response)
                    if(response.data != false){
                        console.log("access success!")
                        setAuth(true);
                    }else{
                        const refresh_response = await axios.post("/auth/refresh_token", null, {
                            headers:{ Authorization: `Bearer ${localStorage.getItem("access-token")}`},
                            withCredentials: true, 
                          })
                          localStorage.setItem("access-token", refresh_response.data.accessToken)
                          console.log("from refresh response :",refresh_response)
                    }
                }catch(error){
                    console.log(error);
                }
        }

        const process = async () =>{
            await check_auth();
        }
        process();
    }, [auth])

    const mouseOver = () => {
        setIsHovering(true);
    }
    const mouseOut = () => {
        setIsHovering(false)
    }
    const logOut = async() => {
        if(window.confirm("로그아웃 하시겠습니까?")){
            const response = await axios.post("/auth/logout", null, {
                headers:{ Authorization: `Bearer ${localStorage.getItem("access-token")}`},
                withCredentials: true, // 이 옵션을 설정하여 쿠키와 인증 정보를 함께 보냄
              })
            console.log("logout :", response)
            localStorage.setItem("access-token", "")
            document.cookie = ""
            setAuth(false)
        }
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
                    <a href="/"><li>정보</li></a>
                </ul>
            </div>
            <div className="center-nav">
                <a href="/"><h1>홈 이미지</h1></a>
            </div>
            <div className="right-nav">
                <ul>
                    <a href="/board">
                        <li className={isHovering? "menu-4 slide" : "menu-4"} onMouseOver={mouseOver} onMouseOut={mouseOut} style={{color: "black"}}>고객지원(board)
                            <ul className="side-menu">
                                    <li>자주묻는 질문</li>
                                    <li>질문 게시판</li>
                                    <li>1:1 문의</li>
                            </ul>
                        </li>
                    </a>
                    <a href="/signup"><li style={{color: "black"}}>회원가입</li></a>
                    {!auth ? <a href="/login"><li style={{color: "black"}}>로그인</li></a> : <a href="/" onClick={logOut}><li style={{color: "black"}}>로그아웃</li></a> }                      
                </ul>
            </div>        
        </div>
    </div>
  );
}

export default Header;

