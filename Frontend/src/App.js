
import './App.css';
import Header from './Header';
import Footer from './Footer';
import Login from './Login';
import Login2 from './Login2';
import About from './About';
import Main from './Main';
import Main2 from './Main2';
import Main3 from './Main3';
import Leaderboard from './Leaderboard';
import Account from './Account';
import Signup from './Signup';
import {
  BrowserRouter as Router, Routes,
  Route, Redirect,
} from "react-router-dom";
function App() {
  return (
    <>

      <Header/>
      <Routes>

      
        {/* < Route path="/" element={<Login />} />
        < Route path="/signup" element={<Signup />} /> */}

        <Route path="/home" element={<Main />} />

      
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
