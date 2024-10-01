import React from "react";
import axios from 'axios';
function Member() {
  return (
      <div>
        <h1>회원가입</h1>
        <div>
            <input type="text"></input><button>중복확인</button><span>사용가능한 아이디 입니다.</span>
        </div>
        <div>
            <input type="password"></input><button>중복확인</button><span>사용가능한 비밀번호 입니다.</span>
        </div>
        <div><button>회원가입하기</button></div>
      </div>   
  );
}

export default Member;