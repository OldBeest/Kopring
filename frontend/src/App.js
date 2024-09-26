import './App.css';
import Header from './header';
import Footer from './footer';
import Main from './main';

function App() {
  return (
    <div className="App">
      <Header/>
      <Main/>
      <Footer/>
    </div>
  );
}

// function Login(){
//   return (
//     <div className="App">
//       <Header/>
//       <div>
//         <ul>
//           <li>아이디 입력</li>
//           <li>비밀번호 입력</li>
//           <button>로그인</button>
//         </ul>
//       </div>
//       <Footer/>
//     </div>
//   );
// }
export default App;
