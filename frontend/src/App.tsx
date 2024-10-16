import './App.css';
import React, { useEffect, useState } from "react";
import Header from './components/header';
import Footer from './components/footer';
import Main from './components/main';
import Login from './components/login';
import Board from './components/board';
import Post from './components/post';
import Signup from './components/signup';
import Facility from './components/facility';
import { Route, Routes } from 'react-router-dom';
function App(){

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<div><Header/><Main/><Footer/></div>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/board' element={<div><Header/><Board/><Footer/></div>}></Route>
        <Route path='/post' element={<div><Header/><Post/><Footer/></div>}></Route>
        <Route path='/facility' element={<div><Header/><Facility></Facility><Footer/></div>}></Route>
      </Routes>
    </div>
  );
}
export default App;
