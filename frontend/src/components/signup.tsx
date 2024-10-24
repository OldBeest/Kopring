import React, { useEffect, useRef, useState } from "react";
import '../styles/signup.css'
import axios from "axios";

interface MemberDto{
  id: string;
  pw: string;
  email: string;
  name: string;
  address: string;
  phone: string;
  birthDate: string;
  gender: string;
  disease: string;
  feature: string;
}

function Member() {
  
  const diseases: string[] = ['암', '뇌혈관질환', '중추신경계질환', '근골격계질환', '심폐질환', '치매']
  const features: string[] = ['도심위치', '최신시설', '대형병원인접', '암특화치료', '여성전용', '치매전문']

  const idInput = useRef<HTMLInputElement>(null)
  const [pwInput, setPwInput] = useState("")
  const [validId, setValidId] = useState<string>("")
  const [validPw, setValidPw] = useState<string>("영어, 숫자, 특수문자가 포함된 8-15자리")
  const [equalPw, setEqualPw] = useState<string>("")
  const [isValid, setIsValid] = useState<string>("")
  const [isValidId, setIsValidId] = useState<string>("")
  const [isValidPw, setIsValidPw] = useState<string>("")
  const [isEqualPw, setIsEqualPw] = useState<string>("")
  const [checkBox, setCheckBox] = useState<String>()

  const [formState, setFormState] = useState<MemberDto>({
    id: "",
    pw: "",
    email: "",
    name: "",
    address: "",
    phone: "",
    birthDate: "",
    gender: "",
    disease: "",
    feature: ""
  })

  const checkValidId = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if(idInput.current?.value !== ""){
      const response = await fetch("/api/check_id?id=" + (idInput.current?.value)?.toString(), {method: 'GET'})
      const data = await response.json()
      setIsValid(data.result)
      if(data.result === "isValid"){
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

  const checkValidPw = (pw : string) => {
    const regExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
    if(pw !== ""){
      if(regExp.test(pw)){
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
    setPwInput(pw) 
  }

  const checkEqualPw = (checkpw : string) => {
    const currentValue = checkpw

    if(currentValue !== ""){

      if((currentValue === pwInput)){
        setIsEqualPw("isValid")
        setEqualPw("비밀번호가 일치합니다.")
      }
      else{
        setIsEqualPw("isNotValid")
        setEqualPw("비밀번호가 일치하지 않습니다.")
      }
      
    }else{
      setIsEqualPw("")
      setEqualPw("비밀번호를 입력해 주세요.")
    } 
  }

  const checkData = async (event: React.MouseEvent<HTMLButtonElement>) =>{
    event.preventDefault()
    if (Object.values(formState).includes("")){
      alert("항목에 빈 내역이 있습니다.")
    } else {
      if(isValid === "isValid" && isValidPw === "isValid"&& isEqualPw && "isValid"){
        alert("회원가입이 성공적으로 되었습니다.")
        axios.post("/signup", formState)
        
      }
      else{
        alert("아이디랑 비밀번호를 다시 확인해 주세요.")
        return false
      }
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    const { name, value, type, checked } = event.target;
    const key = name as keyof MemberDto

    if (type === "checkbox"){
      if (key === "disease" || key === "feature"){
        setFormState((prevState) => {
          const currentValue = prevState[key] || "";

          if (checked) {
            return {...prevState, [key]: currentValue? `${currentValue},${value}` : value};
          }
          else {
            const updateValue = currentValue.split(",").filter((item) => item !== value).join(",");
            return {...prevState, [key]: updateValue};
          }
        }
      )
      } else {
        setFormState((prevState) => ({
          ...prevState, [key]: value
        }));
      }
    } else {
      if (name === "pw"){
        checkValidPw(event.target.value)
      } else if (name === "checkpw"){
        checkEqualPw(event.target.value)
      }
      setFormState((prevState) => ({
        ...prevState, [key]: value
      }));
      
    }
  };

  useEffect(() => {
  }, [formState])


  return(
    <div className="signup-background">
        <div className="signup-wrapper">
        <form>
      <h1>회원가입</h1>
      <div className="control">
        <label className="signup-label">아이디</label>
        <br></br>
        <input type="text" name="id" ref={idInput} onChange={handleChange}></input><button onClick={checkValidId}>중복확인</button><span className={isValid}>{isValid ? (isValid === "isValid" ? "사용 가능한 아이디 입니다." : "사용 불가능한 아이디 입니다.") : "아이디를 입력해 주세요."}</span>
      </div>
      <div className="control">
        <label className="signup-label">비밀번호</label>
        <br></br>
        <input type="password" name="pw" onChange={handleChange}></input><span className={isValidPw}>{validPw}</span>
      </div>
      <p></p>
      <div className="control">
        <label className="signup-label">비밀번호확인</label>
        <br></br>
        <input type="password" name="checkpw" onChange={handleChange}></input><span className={isEqualPw}>{equalPw}</span>
      </div>
      <p></p>
      <div className="control">
        <label className="signup-label">이메일</label>
        <br></br>
        <input type="email" name="email" onChange={handleChange}></input>
      </div>
      <p></p>
      <div className="control">
        <label className="signup-label">이름</label>
        <br></br>
        <input type="text" name="name" onChange={handleChange}></input>
      </div>  
      <p></p>
      <div className="control">
        <label className="signup-label">주소</label>
        <br></br>
        <input type="text" name="address" onChange={handleChange}></input><button>입력</button>
      </div>  
      <p></p>  
      <div className="control">
        <label className="signup-label">연락처</label>
        <br></br>
        <input type="text" name="phone" maxLength={13} onChange={handleChange}></input><button>입력</button>
      </div>
      <p></p>
      <div className="control">
        <label className="signup-label">생년월일</label>
        <br></br>
        <input type="date" name="birthDate" onChange={handleChange}></input><button>입력</button>
      </div>
      <p></p>
      <div className="control">
        <label className="signup-label">성별</label>
        <br></br>
        <input type="radio" id="male" name="gender" value="남성" onChange={handleChange}/>
        <label htmlFor="male">남성</label>
        <input type="radio" id="female" name="gender" value="여성" onChange={handleChange}/>
        <label htmlFor="female">여성</label>
      </div>
      <p></p>
      <div className="control">
        <label className="signup-label">질환</label>
        <div style={{display: "flex", justifyContent: "center"}}>
          {diseases.map(disease => (<div key={disease}><input type="checkbox" name="disease" value={disease} onChange={handleChange}/>{disease}</div>))}
        </div>
      </div>
      <div className="control">
        <label className="signup-label">특성</label>
        <div style={{display: "flex", justifyContent: "center"}}>
          {features.map(feature => (<div key={feature}><input type="checkbox" name="feature" value={feature} onChange={handleChange}/>{feature}</div>))}
        </div>
      </div>
      <div><button onClick={checkData}>회원가입하기</button></div>    
    </form>
      </div>
    </div>
    
    
  
  );
}

export default Member;