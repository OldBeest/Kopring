import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  const [list, setList] = useState('');
  useEffect(()=>{
    axios.get("/index")
    .then(response => setList(response.data))
    .catch(error => console.log(error))
  }, []);
  return (
    <div className="App">
      <h1>여기는 메인 페이지</h1>
      <h2>{list.ad_facility[0].name}</h2>            
    </div>
  );
}

export default App;
