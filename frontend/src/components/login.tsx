import axios from "axios";
import React from "react";
import '../styles/login.css'
import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import googleImg from "../assets/google_login.png"

const submit = (idValue: string, pwValue: string) => {
    const userInfo = {
        id: idValue,
        pw: pwValue
    }
    
    const onLogin = async () =>{
        try{
            console.log(userInfo)
            const response = await axios.post("/auth/get_token", null, {params: userInfo})
            const accessToken = response            
            if(accessToken.data != ""){          
                localStorage.setItem("access-token", accessToken.data["accessToken"])
                alert("로그인에 성공했습니다.")
                window.location.href = "/"
            }
            else{
                alert("아이디와 비밀번호가 일치하지 않습니다.")
            }
        }
        catch(error){
            console.log(error)
        }
    }
    onLogin();
    
}


function Login() {
    const [idValue, setId] = useState('')
    const [pwValue, setPw] = useState('')

    const changeId = (e: any) => {
        setId(e.target.value);
    }
    
    const changePw = (e: any) => {
        setPw(e.target.value);
    }

    return (
    <div className="login-background">
        <div className="login-wrapper">
        <h1>로그인</h1>
        <br></br>
        <div>
        아이디 &nbsp;&nbsp;&nbsp;<input className="login_id" name="id" type='text' value={idValue} onChange={changeId}></input>
        </div>
        <br></br>
        <div>
        비밀번호 <input className="login_pw" name="pw" type='password' value={pwValue} onChange={changePw}></input>
        </div>
        <div>
        <a href="/signup"><button>회원가입</button></a>
            <button onClick={() => {submit(idValue, pwValue)}}>&nbsp;로그인&nbsp;</button>
        </div>
        <div>
            <a href="/api/oauth/kakao"><div className="kakao-login"></div></a>
        </div>
        <div>
            <a href="/api/oauth/naver"><div className="naver-login"></div></a>
        </div>
        <div>
            <a href="/api/oauth/google"><div className="google-login"><img src={googleImg}></img>&nbsp;&nbsp;Google 계정으로 로그인</div></a>
        </div>
    </div>
    </div>
    
        
  );
}

export default Login;