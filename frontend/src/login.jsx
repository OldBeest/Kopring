import React from "react";
import { useEffect, useState } from "react";

const submit = (idValue, pwValue) => {
    console.log("아이디 : ", idValue)
    console.log("비번 :", pwValue)
}

function Login() {
    const [idValue, setId] = useState('')
    const [pwValue, setPw] = useState('')

    const changeId = (e) => {
        setId(e.target.value);
    }
    
    const changePw = (e) => {
        setPw(e.target.value);
    }

    return (
    <div>
        <div>
        아이디 입력 : <input className="login_id" name="id" type='text' value={idValue} onChange={changeId}></input>
        </div>
        <div>
        비밀번호 입력 : <input className="login_pw" name="pw" type='password' value={pwValue} onChange={changePw}></input>
        </div>
        <button onClick={submit(idValue, pwValue)}>로그인</button>
    </div>
        
  );
}

export default Login;