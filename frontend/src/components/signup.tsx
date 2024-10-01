import React, { MutableRefObject, useRef, useCallback, useState } from "react";
import '../styles/signup.css'
function Member() {
  
  const idInput = useRef<HTMLInputElement>(null)
  const [pwInput, setPwInput] = useState("")
  const [validId, setValidId] = useState<string>("")
  const [validPw, setValidPw] = useState<string>("비밀번호를 입력해 주세요.")
  const [equalPw, setEqualPw] = useState<string>("")
  const [isValidId, setIsValidId] = useState<string>("")
  const [isValidPw, setIsValidPw] = useState<string>("")
  const [isEqualPw, setIsEqualPw] = useState<string>("")

  const checkValidId = async () => {
    if(idInput.current?.value != ""){
      const response = await fetch("/api/check_id?id=" + (idInput.current?.value)?.toString(), {method: 'GET'})
      const data = await response.json()
      setIsValidId(data.result)
    
      if(data.result == "isValid"){
        setValidId("사용 가능한 아이디 입니다.")      
      }
      else{
        setValidId("사용 불가능한 아이디 입니다.")      
      }
    }else{
      setIsValidId("")
      setValidId("아이디를 입력해 주세요.")
    } 
  }

  const checkValidPw = (event: any) => {
    const regExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
    if(event.target.value != ""){
      if(regExp.test(event.target.value)){
        setIsValidPw("isValid")
        setValidPw("적절한 비밀번호 입니다.")
      }
      else{
        setIsValidPw("isNotValid")
        setValidPw("적절하지 못한 비밀번호 입니다.")
      }
      
    }else{
      setIsValidPw("")
      setValidPw("비밀번호를 입력해 주세요.")
    } 
  }

  const checkEqualPw = (event: any) => {
    if(event.target.value != ""){
      if((event.target.value)){
        setIsValidPw("isValid")
        setValidPw("비밀번호가 일치합니다.")
      }
      else{
        setIsEqualPw("isNotValid")
        setValidPw("비밀번호가 일치하지 않습니다")
      }
      
    }else{
      setIsEqualPw("")
      setEqualPw("비밀번호를 입력해 주세요.")
    } 
  }

  
  return (
      <div>
        <h1>회원가입</h1>
        <div className="userId">
            아이디 <input type="text" ref={idInput}></input><button onClick={checkValidId}>중복확인</button><span className={isValidId}>{validId}</span>
        </div>
        <div>
            비밀번호 <input type="password" onChange={checkValidPw}></input><span className={isValidPw}>{validPw}</span>
        </div>
        <div>
            비밀번호확인 <input type="password" onChange={checkEqualPw}></input><span className={isEqualPw}>{validPw}</span>
        </div>
        <div>
            이메일 <input type="email"></input><button>중복확인</button><span>사용가능한 이메일 입니다.</span>
        </div>
        <div>
            이름 <input type="text"></input>
        </div>
        <div>
            주소 <input type="text"></input><button>입력</button>
        </div>
        <div>
            연락처 <input type="text" maxLength={13}></input><button>입력</button>
        </div>
        <div>
            생년월일 <input type="date"></input><button>입력</button>
        </div>
        <div>
          성별
          <input type="radio" id="male" name="gender" value="남성" />
          <label htmlFor="male">남성</label>
          <input type="radio" id="female" name="gender" value="여성" />
          <label htmlFor="female">여성</label>
        </div>
        <div className="searchBox">
          <h3>질환</h3>
          <input type="checkbox" name="disease" value="암" /> 암
          <input type="checkbox" name="disease" value="뇌혈관질환" /> 뇌혈관질환
          <input type="checkbox" name="disease" value="중추신경계질환" /> 중추신경계질환
          <input type="checkbox" name="disease" value="근골격계질환" /> 근골격계질환
          <input type="checkbox" name="disease" value="심폐질환" /> 심폐질환
          <input type="checkbox" name="disease" value="치매" /> 치매
        </div>
        <div className="searchBox">
          <h3>특성</h3>
          <input type="checkbox" name="feature" value="도심위치" /> 도심위치
          <input type="checkbox" name="feature" value="최신시설" /> 최신시설
          <input type="checkbox" name="feature" value="대형병원인접" /> 대형병원인접
          <input type="checkbox" name="feature" value="암특화치료" /> 암특화치료
          <input type="checkbox" name="feature" value="여성전용" /> 여성전용
          <input type="checkbox" name="feature" value="치매전문" /> 치매전문
        </div> 
        <div><button>회원가입하기</button></div>
      </div>   
  );
}

export default Member;