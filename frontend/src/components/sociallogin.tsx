import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { redirect } from "react-router-dom";

function SocialLogin() {

    let loginType = window.location.href.split("http://localhost:3000/sociallogin/")[1].split("?")[0].trim()
    
    const kakaoLogin = async() => {
        const REST_API_KEY = process.env.REACT_APP_KAKAO_API_KEY
        const REDIRECT_URI = "http://localhost:3000/sociallogin/kakao"
        
        const code = new URL(window.location.href).searchParams.get("code")
        const result = await axios.post("https://kauth.kakao.com/oauth/token",{
            grant_type: "authorization_code",
            client_id: REST_API_KEY,
            redirect_uri: REDIRECT_URI,
            code: code
        },
            {headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
            
        }
        )
        const userInfo = await axios.get("/auth/kakao_user", {params: {access_token : result.data.access_token}})
        console.log(userInfo)
        localStorage.setItem("access-token", userInfo.data)
        window.location.href = "/"
        
    }

    const naverLogin = async() => {
        const code = new URL(window.location.href).searchParams.get("code")
        
        const result = await axios.post("/auth/naver_login", {code: code, client_id: process.env.REACT_APP_NAVER_CLIENT_ID, client_secret: process.env.REACT_APP_NAVER_CLIENT_SECRET, state: "1234567890987654321"})
        const userInfo = await axios.get("/auth/naver_user", {params: {access_token : result.data.access_token}})
        console.log("유저 정보:", userInfo)
        localStorage.setItem("access-token", userInfo.data)
        window.location.href = "/"
        
    }

    const googleLogin = async() => {
        const REDIRECT_URI = "http://localhost:3000/sociallogin/google"
        const code = new URL(window.location.href).searchParams.get("code")
        
        const result = await axios.post("https://oauth2.googleapis.com/token", {
            code: code,
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            client_secret: process.env.REACT_APP_GOOGLE_CLIENT_PASSWORD,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code"
        })

        if (result.data.access_token !== ""){
            const userInfo = await axios.get("/auth/google_user", {params: {access_token: result.data.access_token}})
            console.log("jwt :", userInfo.data)
            localStorage.setItem("access-token", userInfo.data)
            window.location.href = "/"
        }
        
    }

    if (loginType === "kakao"){
        kakaoLogin()
    } else if(loginType === "naver"){
        naverLogin()
    } else if(loginType === "google"){
        googleLogin()
    }
    

  return (
      <h1>소셜로그인</h1>   
  );
}

export default SocialLogin;