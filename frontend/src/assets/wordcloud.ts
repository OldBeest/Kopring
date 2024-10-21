export const myConfig = {
    type: 'wordcloud',
    options: {
     words: [
     {
       text: "서울특별시",
       count: 80
     },
     {
       text: "암",
       count: 70
     },
     {
       text: "치매",
       count: 60
     },
     {
       text: "근골격계질환",
       count: 50
     },
     {
       text: "최신시설",
       count: 40
     },
     {
       text: "여성전용",
       count: 30
     },
     {
       text: "도심위치",
       count: 20
     },
     {
       text: "편의시설",
       count: 10
     },
     {
       text: "치매전문",
       count: 25
     },
     {
       text: "강서구",
       count: 8
     },
     {
       text: "인천광역시",
       count: 5
     },
     {
       text: "경기도",
       count: 3
     },
     {
       text: "요양병원",
       count: 7
     },
     {
       text: "관악구",
       count: 24
     },
     {
       text: "대형병원인접",
       count: 35
     },
     {
       text: "강남구",
       count: 16
     },
     {
       text: "뇌혈관질환",
       count: 47
     },
     {
       text: "암특화치료",
       count: 19
     },
     
   ],
      minLength: 3,
      ignore: [""],
      maxItems: 20,
      aspect: 'spiral', // 'flow-top' | 'flow-center'
   
      colorType: 'palette',
      palette: ['#D32F2F', '#5D4037', '#1976D2', '#E53935', '#6D4C41', '#1E88E5', '#F44336', '#795548', '#2196F3', '#EF5350', '#8D6E63', '#42A5F5'],
   
      style: {
        fontFamily: 'Crete Round',
   
        hoverState: {
          backgroundColor: '#D32F2F',
          borderRadius: 2,
          fontColor: 'white'
        },
        tooltip: {
          text: '%text: %hits',
          visible: true,
          alpha: 0.9,
          backgroundColor: '#1976D2',
          borderRadius: 2,
          borderColor: 'none',
          fontColor: 'white',
          fontFamily: 'Georgia',
          textAlpha: 1
        }
      }
    },
   
    source: {
      fontColor: '#64B5F6',
      fontSize: 10,
      fontFamily: 'Georgia',
      fontWeight: 'normal',
      marginBottom: '10%'
    }
  };
