import React from "react";
import './main.css';
import video1 from './main1.mp4';
import {useState, useEffect} from 'react';
import axios from 'axios';
function Main(){
    const [list, setList] = useState('');
    useEffect(()=>{
      axios.get("/index")
      .then(response => setList(response.data))
      .catch(error => console.log(error))
    }, []);
    return(
        <div className="main-wrap">
            <div className="main-image">
                <video autoPlay muted playsInline loop>
                    <source src={video1} type="video/mp4"/>
                </video>
            </div>
            <div className="main-middle">
                <div className="news-card">
                    <h3>뉴스카드</h3>
                    <div>
                        <div className="news-title">뉴스제목</div>
                        <div className="news-content">뉴스내용</div>
                        <div className="news-link">뉴스링크</div>
                    </div>
                </div>
                <div className="video-list">
                    <h3>건강영상</h3>
                    <div className="video-content">영상내용</div>
                </div>
                <div className="ad-facility">
                    <h3>시설광고</h3>
                    <div className="facility-content">
                        <div>
                            {list.ad_facility[0].name}
                        </div>
                        <div>
                            {list.ad_facility[0].address}
                        </div>
                        <div>
                            {list.ad_facility[0].disease}
                        </div>
                        <div>
                            {list.ad_facility[0].feature}
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="map-recommend">
                <div className="map">
                    <div>카카오맵</div>
                    <div></div>
                </div>
                <div className="recommend">
                    <div>지도 기반 시설</div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}
export default Main;