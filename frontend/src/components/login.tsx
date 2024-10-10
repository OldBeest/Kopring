import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";

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
            if(accessToken){          
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
    <div>
        <h2>로그인 페이지</h2>
        <div>
        아이디:  <input className="login_id" name="id" type='text' value={idValue} onChange={changeId}></input>
        </div>
        <div>
        비밀번호: <input className="login_pw" name="pw" type='password' value={pwValue} onChange={changePw}></input>
        </div>
        <div>
            <button>회원가입</button>
            <button onClick={() => {submit(idValue, pwValue)}}>로그인</button>
        </div>
        <div>
            카카오 로그인
        </div>
        <div>
            네이버 로그인
        </div>
        <div>
            구글 로그인
        </div>
    </div>
        
  );
}

export default Login;