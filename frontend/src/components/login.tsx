import axios from "axios";
import React from "react";
import '../styles/login.css'
import { useEffect, useState } from "react";
import googleImg from "../assets/google_login.png"
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, setLoginType } from '../store'


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

    let loginType = useSelector((state: RootState) => state);
    const dispatch = useDispatch<AppDispatch>();


    const changeId = (e: any) => {
        setId(e.target.value);
    }
    
    const changePw = (e: any) => {
        setPw(e.target.value);
    }

    const kakaoLogin = async() => {
        const REST_API_KEY = process.env.REACT_APP_KAKAO_API_KEY
        const REDIRECT_URI = "http://localhost:3000/sociallogin/kakao"   
        const KAKAO_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`  
        
        window.location.href = KAKAO_URL

    }

    const naverLogin = async() => {
        const CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID
        const STATE = "1234567890987654321"
        const REDIRECT_URI = "http://localhost:3000/sociallogin/naver"
        const NAVER_URL = `https://nid.naver.com/oauth2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&state=${STATE}`

        window.location.href = NAVER_URL
        
    }
    
    const googleLogin = async() => {
        const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
        const REDIRECT_URI = "http://localhost:3000/sociallogin/google"
        const GOOGLE_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&include_granted_scopes=true&response_type=code&redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}`

        window.location.href = GOOGLE_URL
    }

    useEffect(() => {
        console.log("로그인에서 :",loginType.logintype.type)
    }, [loginType]); // loginType이 변경될 때마다 로그 출력

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
            <a href="#"><div className="kakao-login" onClick={() => {kakaoLogin()}}></div></a>
        </div>
        <div>
            <a href="#"><div className="naver-login" onClick={() => {naverLogin()}}></div></a>
        </div>
        <div>
            <a href="#"><div className="google-login" onClick={() => googleLogin()}><img src={googleImg}></img>&nbsp;&nbsp;Google 계정으로 로그인</div></a>
        </div>
    </div>
    </div>
    
        
  );
}

export default Login;