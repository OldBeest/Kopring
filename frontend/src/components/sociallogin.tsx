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
        
    }

    const naverLogin = async() => {
        const code = new URL(window.location.href).searchParams.get("code")
        const result = await axios.post("/auth/naver_login", {code: code})
        console.log(result.data)
        const userInfo = await axios.get("https://openapi.naver.com/v1/nid/me", {headers: {"Authorization": `Bearer ${result.data.access_token}`}, withCredentials: true})
        console.log(userInfo)
        
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

        console.log(result.data)
        console.log(result.data.access_token)
        
        if (result.data.access_token !== ""){
            // const userInfo = await axios.get("/auth/google_login", {headers: {Authorization: `Bearer ${result.data.access_token}`}})
            const userInfo = await axios.get("https://www.googleapis.com/userinfo/v2/me", {headers: {Authorization: `Bearer ${result.data.access_token}`}})
            console.log(userInfo.data)
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