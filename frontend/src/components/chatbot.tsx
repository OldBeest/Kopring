import '../styles/chatbot.css'

function Chatbot(){
    return(
        <div className='chatbot-wrapper'>
            <div className='chatbot-introduce'>
                <div className='introduce-top'>
                안녕하세요! 저는 치매박사 안깜빡이라고 해요!
                </div>
                <div className='introduce-middle'>
                    <div className='introduce-wrapper'>
                        <div className='introduce-menu'>
                            <div>1. 소개</div>
                            <div>2. 소개</div>
                            <div>3. 소개</div>
                            <div>4. 소개</div>
                        </div>
                        <div className='introduce-content'>
                            <div>1. 내용</div>
                            <div>2. 내용</div>
                            <div>3. 내용</div>
                            <div>4. 내용</div>
                        </div>
                    </div>
                </div>
                <div className='introduce-bottom'>
                    챗봇 학습내용
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
                            <div className="bot-text">안녕하세요? 저는 깜빡이에요~! 무엇을 도와 드릴까요?<br></br>---원하시는 내용을 선택해보세요---<br></br>1. 알츠하이머 정보<br></br>2. 치매 관련 정보</div>
                        </div>
                    </div>
                    <div className="conversation-input">
                        <input className="text-input" type="text" placeholder="상담받을 내용을 입력하세요."/>
                        <button type="submit" id="submit-text">입력</button>
                    </div>
                    </div>
            </div>
            </div>
        </div>
    );
}

export default Chatbot;