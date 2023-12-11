import React from 'react'
import myimage from './images/i_am_sherlocked_wallpaper_by_chriscodesigns_d6097no-pre.jpg';
import './Header.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
export default function Header() {
  return (
    <>
      <nav className="navbar">
        <img src={myimage} alt="where is pic" className="brand-logo" />
        <h1 className="title1">SHERLOCK</h1>
        <ul className="nav-links">
          
          <li className="nav-items"><h3><Link to="/about">About </Link></h3></li>
          <li className="nav-items"><h3><Link to="/main">Main </Link></h3></li>
          <li className="nav-items"><h3><Link to="/account">Account </Link></h3></li>
          <li className="nav-items"><h3><Link to="/leaderboard">Leaderboard </Link></h3></li>
        </ul>
      </nav>
    </>
  )
}
