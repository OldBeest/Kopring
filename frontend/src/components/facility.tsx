import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";

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

function Facility() {

    const[facilities, setFacilities] = useState<facilityDto[] | null>();
    
    useEffect(() => {

        const getFacilityList = async() => {
            const result = await axios.get("/facility")
            setFacilities(result.data)
        }
        getFacilityList()

    }, []);
    
    const addFavorite = async (item: facilityDto) => {
        console.log(item)
        const result = await axios.get("/api/favorite", {params: {user_id: "tlsfla", facility_address: item.address}})
        console.log(result.data)
    }

  return (
      <div>
        <h1>시설검색</h1>
        <div style={{width: "100%", display: "flex"}}>
            <div style={{width: "20%"}}>이름</div>
            <div style={{width: "50%"}}>주소</div>
            <div style={{width: "10%"}}>진료과목</div>
            <div style={{width: "10%"}}>특성</div>
            <div style={{width: "10%"}}>즐겨찾기</div>
        </div>
        {facilities && facilities.length > 0 ?
        facilities.slice(0, 10).map((item, index) => 
        (<div key={index} style={{display: "flex"}}>
            <div style={{width: "20%"}}>{item.name}</div>
            <div style={{width: "50%"}}>{item.address}</div>
            <div style={{width: "10%"}}>{item.disease}</div>
            <div style={{width: "10%"}}>{item.feature}</div>
            <div style={{width: "10%"}}><button onClick={() => addFavorite(item)}>⭐</button><button>☆</button></div>
            </div>)) : <div></div>}
        <div><button >더보기</button></div>
    </div>
  );
}

export default Facility;