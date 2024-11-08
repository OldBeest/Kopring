import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import logo from '../assets/logo.png'
import chatboticon from '../assets/chatbotlogo.png'
import '../styles/header.css'

function Header() {
    const [isHovering, setIsHovering] = useState(false);
    const [auth, setAuth] = useState(false)
    const [isLogin, setIsLogin] = useState(false)
    const [userId, setUserId] = useState("")

    useEffect(() => {
        
        const check_auth = async () => {
                try{
                    console.log(localStorage.getItem("access-token"))
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
                    const responseId = await axios.post("/auth/get_userid", null, {
                        headers:{ Authorization: `Bearer ${localStorage.getItem("access-token")}`},
                        withCredentials: true,
                      })
                    setUserId(responseId.data)
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
            console.log(localStorage.getItem("access-token"))
            setAuth(false)
        }
    }
    
  return (
    <div>
        <div className="nav">
            <div className="left-nav">
                <ul className="main-menu">
                    <li className={isHovering? "menu-1 slide" : "menu-1"} onMouseEnter={mouseOver} onMouseLeave={mouseOut}>소개
                        <ul className="side-menu">
                            <li className="sub-menu">사이트 스토리</li>
                            <li className="sub-menu">실버케어 플랫폼 소개</li>
                            <li className="sub-menu">플랫폼 기술</li>
                        </ul>
                    </li>
                    <a href="/facility"><li className="menu-2">시설검색</li></a>
                    <li className={isHovering? "menu-3 slide" : "menu-3"} onMouseEnter={mouseOver} onMouseLeave={mouseOut} style={{color: "black"}}>고객지원
                        <ul className="side-menu">
                            <li className="sub-menu">자주묻는 질문</li>
                            <li className="sub-menu"><a href="/board">질문 게시판</a></li>
                            <li className="sub-menu">1:1 문의</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div className="center-nav">
                <ul className="main-menu">
                    <a href="/"><img src={logo} style={{width: "100px", height: "50px"}}></img></a>
                    <a href="/nonblinker"><img src={chatboticon} style={{width: "50px", height: "50px"}}></img></a>
                </ul>
            </div>
            <div className="right-nav">
                <ul className="main-menu">
                    <a href="/signup"><li className="menu-4">회원가입</li></a>
                    {!auth && !userId ? <li></li> : <li className={isHovering? "menu-4 slide" : "menu-4"} onMouseEnter={mouseOver} onMouseLeave={mouseOut} style={{color: "black"}}>{userId} 님 환영합니다!
                        <ul className="side-menu">
                            <li className="sub-menu">마이페이지</li>
                            {userId === "admin" && <li className="sub-menu">관리자페이지</li>}
                            {!auth ? <li className="sub-menu" style={{color: "black"}}><a href="/login">로그인</a></li> : <li className="sub-menu" style={{color: "black"}}><a href="/" onClick={logOut}>로그아웃</a></li> }        
                        </ul>
                    </li> }
                    {!auth ? <a href="/login"><li className="menu-5" style={{color: "black"}}>로그인</li></a> : <div></div>}                      
                </ul>
            </div>        
        </div>
    </div>
  );
}

export default Header;

