import * as React from "react";
import { useState, useEffect } from "react";
import '../styles/main.css';
import video from '../assets/main1.mp4';
import axios from 'axios';
import { Map, MapMarker } from "react-kakao-maps-sdk"

function Main(){
    const [list, setList] = useState<any | null>([]);

    useEffect(()=>{
      axios.get("/index")
      .then(response => {setList(response.data)
    })
      .catch(error => console.log(error))
    },[]);
    
    return(
        <div className="main-wrap">
            <div className="main-image">
                <video autoPlay muted playsInline loop>
                    <source src={video} type="video/mp4"/>
                </video>
            </div>
            <div className="main-middle">
                <div className="news-card">
                    <h3>뉴스카드</h3>
                    {list.crawllist && list.crawllist.length > 0 ? <div>
                        <div className="news-title">{list.crawllist[0].newsTitle}</div>
                        <div className="news-content">{list.crawllist[0].newsContent}</div>
                        <a href={list.crawllist[0].newsUrl}><div className="news-link">보러가기</div></a>
                    </div> : <div>데이터 로딩중...</div>}
                    
                </div>
                <div className="video-list">
                    <h3>건강영상</h3>
                    <div className="video-content">
                    {list.crawllist && list.crawllist.length > 0 ? <iframe width="560" height="315"
                                src={list.crawllist[1].videoUrl}
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen></iframe> : <div>데이터 로딩중...</div>}
                    
                    </div>
                </div>
                <div className="ad-facility">
                    <h3>시설광고</h3>
                    <div className="facility-content">
                        {list.ad_facility && list.ad_facility.length > 0 ? 
                        <div>
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
                         : <div>데이터 로딩중...</div>}      
                    </div>
                </div>
            </div>
            <div className="map-recommend">
                <div className="map-wrapper">
                    <div>카카오맵</div>
                    <div>
                    <Map center={{ lat: 33.450701, lng: 126.570667 }}
                        style={{ width: '100vh', height: '50vh' }}
                        level={3}>
                    <MapMarker position={{ lat: 33.450701, lng: 126.570667 }}>
                        <div style={{color:"#FBA"}}>Hello World!</div>
                    </MapMarker>
                    </Map> 
                    </div>
                </div>
                <div>
                    
                </div>
                <div className="recommend">
                    <div>지도 기반 시설</div>
                    <div>
                        {list.near_facility && list.near_facility.length > 0 ? 
                        <div>
                            <div>
                                {list.near_facility[0].name}
                            </div>
                            <div>
                                {list.near_facility[0].address}
                            </div>
                            <div>
                                {list.near_facility[0].disease}
                            </div>
                            <div>
                                {list.near_facility[0].feature}
                            </div>
                        </div>
                         : <div>데이터 로딩중...</div>}
                    </div>
                </div>
                <div className="favorite">
                    <div>⭐나의 즐겨찾기⭐</div>
                    <div>즐겨찾기 목록</div>
                </div>
            </div>
        </div>
    );
    
    
}

export default Main;