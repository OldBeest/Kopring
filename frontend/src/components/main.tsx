import { useState, useEffect } from "react";
import '../styles/main.css';
import video from '../assets/main1.mp4';
import axios from 'axios';
import { Map, MapMarker } from "react-kakao-maps-sdk"

interface userInfoDto{    
        
        id: string;
        name: string;
        pw: string;
        email: string;
        birthdate: string;
        phone: string;
        autoLoginToken: string;
        temppw: string;
        gender: string;
        joinDate: string;
        disease: string;
        feature: string;
        address: string;   
}
interface facilityDto{
    name: string;
    region_code: number;
    region_name: string;
    address: string;
    tel: string;
    reg_date: string;
    doc_count: number;
    disease: string;
    feature: string;
    price: number;
    y_cor: number;
    x_cor: number;
    image_path: string;
    ad_status: number;
}
interface Coordinate{
    y_cor: number; 
    x_cor: number;
}

function Main(){

    const [list, setList] = useState<any | null>([]);
    const [userInfo, setUserInfo] = useState<userInfoDto | null>();
    const [coord, setCoord] = useState<Coordinate>({y_cor: 37.56424720827924, x_cor: 126.61761089074419});
    const [nearFacility, setNearFacility] = useState<facilityDto[] | null>();
    const [favorite, setFavorite] = useState<facilityDto[] | null>();
    useEffect(()=>{
      axios.get("/index")
      .then(response => {setList(response.data)
        console.log(response.data)
    })
      .catch(error => console.log(error))
    },[]);

    useEffect(() => {
        const get_userId = async() => {
            const response = await axios.post("/auth/get_userid", null, {
            headers:{ Authorization: `Bearer ${localStorage.getItem("access-token")}`},
            withCredentials: true,
          })
            const result = await axios.get("/api/user_info", {params: {userName: response.data}})
          setUserInfo(result.data)
        }
        get_userId()

        
    }, [])
    
    const get_coordinate = async(address: string) => {
        const REST_API_KEY = "44102386908e102073a79562f84fbcf6"
        const auth = await axios.get("https://dapi.kakao.com/v2/local/search/address", {headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`
        },params: {query: address}})
        console.log("위도 :", auth.data.documents[0].y)
        console.log("경도 :", auth.data.documents[0].x)
        setCoord({y_cor: auth.data.documents[0].y, x_cor : auth.data.documents[0].x})
        
        const getNearFacility = async() => {
            const near_facility = await axios.get("/api/near_facility", {params : {y_cor : coord.y_cor, x_cor : coord.x_cor}})
            setNearFacility(near_facility.data)
        }
        getNearFacility() 
    }
    
    useEffect(() => {
        if(userInfo && userInfo.address){
            get_coordinate(userInfo?.address)   
            console.log(userInfo?.address)
        } 
    }, [userInfo])    
    
    useEffect(() => {
        const getFavorite = async () => {
            const result = await axios.get("/api/favorite", {params: {user_id: "tlsfla"}})
            setFavorite(result.data)
        }
        getFavorite();
    }, [])
    

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
                    <Map center={{ lat: coord?.y_cor, lng: coord.x_cor }}
                        style={{ margin: "0 auto", width: '70vh', height: '40vh' }}
                        level={3}>
                    <MapMarker position={{ lat: coord?.y_cor, lng: coord.x_cor }}>
                        <div style={{color:"black"}}>IM HERE!</div>
                    </MapMarker>
                    </Map> 
                    </div>
                </div>
                <div>
                    
                </div>
                <div className="recommend">
                    <div>가까운 시설 추천</div>
                    <div>
                        {nearFacility&& nearFacility.length > 0 ? 
                        nearFacility.slice(0, 3).map((item ,index) => (
                        <div key={index}>
                            <div>{item.name}</div>
                            <div>{item.address}</div>
                            <div>{item.disease}</div>
                            <div>{item.feature}</div>
                            <p>------</p>
                        </div>))
                         : <div>데이터 로딩중...</div>}
                    </div>
                </div>
                <div className="favorite">
                    <div>⭐나의 즐겨찾기⭐</div>                    
                    {favorite && favorite.length > 0 ? favorite.map((_, index) => 
                        (<div>
                        <div>{favorite[index].name}</div>
                        <div>{favorite[index].address}</div>
                        <div>{favorite[index].disease}</div>
                        <div>{favorite[index].feature}</div>
                        </div>)): 
                            <div>로딩중...</div>}
                    
                </div>
            </div>
        </div>
    );
    
    
}

export default Main;