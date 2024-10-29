import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store";

function SocialLogin() {

    let loginType = window.location.href.split("http://localhost:3000/sociallogin/")[1].split("?")[0].trim()
    
    const kakaoLogin = async() => {
        const REST_API_KEY = "44102386908e102073a79562f84fbcf6"
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
        const userInfo = await axios.get("https://openapi.naver.com/v1/nid/me", {headers: {"Authorization": `Bearer ${result.data.access_token}`}})
        console.log(userInfo)
        
    }

    if (loginType === "kakao"){
        kakaoLogin()
    } else if(loginType === "naver"){
        naverLogin()

    }
    

  return (
      <h1>소셜로그인</h1>   
  );
}

export default SocialLogin;