import './App.css';
import Header from './header';
import Footer from './footer';
import Main from './main';
import Login from './login';
import Board from './board';
import { Route, Routes } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<div><Header/><Main/><Footer/></div>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/board' element={<div><Header/><Board/><Footer/></div>}></Route>
      </Routes>
    </div>
  );
}
export default App;
