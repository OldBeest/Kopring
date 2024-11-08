import '../styles/chatbot.css'
import chatbot_video from '../assets/chatbot.mp4'
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import chatbot_icon from '../assets/chatbot_icon3.png'
import human_icon from '../assets/human_icon2.png'

function Chatbot(){

    const text1 = `깜빡깜빡하시는 분들을 위해 제가 대신 기억해주고 도움을 주고 싶어서 안깜빡이라고 이름을 지었어요. 저는 메모리라는 것을 이용해 저장하고 기억하기 때문에 한 번 기억하면 절대로 잊어버리지 않아요!`
    const text2 = `저는 지난 8월달 실버타운이라는 프로젝트에서 탄생했어요! 🌱HP라는 분이 이름을 지어주셨어요. 지금은 Seq2Seq라는 구조로 되어있지만, 앞으로 어텐션과 트랜스포머 등 많은 변화를 가질 예정이니 기대해 주세요!`
    const text3 = `저는 처음에 AIHUB라는 곳에서 '초거대 헬스케어 상담 내역'이라는 빅데이터 자료로 공부를 시작했어요. 그 중에서 알츠하이머와 치매에 관한 내용을 주로 공부했어요. 앞으로 다양한 의료 분야에 대해 공부하려고 계획중이에요!`
    const text4 = `지금은 Pytorch를 이용해 질문과 답변 문장을 단어별로 토큰화해서 저만의 단어사전을 만들어서, 지도학습을 하고있어요. 앞으로 RAG와 LangChain등 다양한 방법을 통해 학습해서 더 똑똑해질거에요!`


    const [isHover, setIsHover] = useState<Boolean>(false);
    const [introText, setIntroText] = useState<string | undefined >();
    const [currentText, setCurrentText] = useState<string>();
    const askText = useRef<HTMLInputElement | null>(null);
    const [inHtml, setInHtml] = useState<Element>();

    const askToChatbot = async() => {
        let a = document.querySelector('.conversation-text');
        console.log(a)    

        console.log(askText.current?.value)
        const result = await axios.get("http://127.0.0.1:8000/ask", {params: {question: askText.current?.value}})
        console.log("chatbot response", result.data)
    }

    let typeInterval: any;

    const onHover = async(number: number) => {
        setIsHover(true)

        if (number === 1){
            setCurrentText(text1)          
        } else if (number === 2){
            setCurrentText(text2)  
        } else if (number === 3){
            setCurrentText(text3)  
        } else if (number === 4){
            setCurrentText(text4)  
        } else{
            return
        }

    }

    const offHover = () => {
        clearInterval(typeInterval)
        setIsHover(false) 
    }

    useEffect(() =>{
        let content1 = '';
        let count = 0;
        if(isHover && currentText){
            typeInterval = setInterval(() => {
                if(count >= currentText.length){
                    clearInterval(typeInterval)
                    return
                }
                content1 += currentText[count++];
                setIntroText(content1)
            }, 65)   
        }
        
        return () => {
            setIntroText('')
            clearInterval(typeInterval)
        }

    }, [isHover, currentText])

    useEffect(() => {

    }, [inHtml])
    return(
        <div className='chatbot-wrapper'>
            <div className='chatbot-introduce'>
                <div className='introduce-top'>
                    안녕하세요? 저는 치매박사가 되고싶은 안깜빡이라고 해요!                    
                </div>
                <div className='introduce-top1'>
                     Hello! I'm nonblinker. I want to be a dementia doctor!
                </div>
                <div className='introduce-middle'>                
                    <div className='introduce-wrapper'>
                        <div className='introduce-menu'>
                            <div className='introduce-submenu submenu1' onMouseOver={() => onHover(1)} onMouseOut={offHover}>왜 안깜빡이야 ?</div>
                            <div className='introduce-submenu submenu2' onMouseOver={() => onHover(2)} onMouseOut={offHover}>어디서 왔어 ?</div>
                            <div className='introduce-submenu submenu3' onMouseOver={() => onHover(3)} onMouseOut={offHover}>뭘 공부하고있어 ?</div>
                            <div className='introduce-submenu submenu4' onMouseOver={() => onHover(4)} onMouseOut={offHover}>어떻게 학습하고있어 ?</div>
                        </div>
                        <div className='introduce-content'>
                            <div className={isHover ? 'introduce-cont-submenu hovering' : 'introduce-cont-submenu'}>{introText}</div>
                        </div>
                        <video autoPlay muted playsInline loop
                        src={chatbot_video}></video>
                    </div>
                </div>
                <div className='introduce-bottom'>
                    <span style={{fontSize: "30px", fontWeight: "700"}}>지금까지 안깜빡이는...</span>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <div className='introduce-bottom-sub'>
                            <span className='introduce-num'>8000</span>개의 문장을 학습했어요.
                        </div>
                        <div className='introduce-bottom-sub'>
                            <span className='introduce-num'>5000</span>개의 단어사전을 만들었어요.
                        </div>
                        <div className='introduce-bottom-sub'>
                            <span className='introduce-num'>50.00</span>%의 정확도를 가지고 있어요.
                        </div>
                    </div>
                    많은 응원 부탁드려요!
                </div>

            </div>
            <div className='chatbot-box'>
                챗봇 모듈
                <div className="box-wrapper">
                    <div className="conversation-box">
                    <div className="box-top">
                    </div>
                    <div className="conversation-text">
                        <div className="talkbox bot-said">
                            <img className="icon" src={chatbot_icon}/>
                            <div className="bot-text">안녕하세요? 저는 안깜빡이에요~! 어떤 내용이 궁금하신가요?</div>
                        </div>
                        <div className="talkbox human-said">
                            <div className="human-text">아으으으아아ㅏ</div>
                            <img className="icon" src={human_icon}/>
                        </div>
                    </div>
                    <div className="conversation-input">
                        <input className="text-input" type="text" placeholder="상담받을 내용을 입력하세요." ref={askText}/>
                        <button type="submit" id="submit-text" onClick={() => askToChatbot()}>입력</button>
                    </div>
                    </div>
            </div>
            </div>
        </div>
    );
}

export default Chatbot;