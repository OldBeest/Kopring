import React from "react";
import facilty_img from '../assets/facility.jpg'
import '../styles/facility_card.css'

interface FacilityCardProps {
  name: string;
  address: string;
  disease: string;
  feature: string;
  price: number;
  children?: any;
}

const FacilityCard: React.FC<FacilityCardProps> = ({name, address, disease, feature, price}) => {
  return (
    <div className="card">
      <div className="card-header">{name}</div>
      <div className="card-body">
        <div className="body-left">
          <img className="facility-img" src={facilty_img}></img>
        </div>
        <div className="body-right">
          <div><span>{address}</span></div>
          <div>진료과목: <span>{disease}</span></div>
          <div>일 이용료 : <span className="facility-price">{price.toLocaleString()}원</span></div>
        </div>       
      </div>
      <div className="card-footer">
          #{disease.split(',').join(" #")}&nbsp;#{feature.split(',').join(" #")}
      </div>      
  </div>
  );
}

export default FacilityCard;