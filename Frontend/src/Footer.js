import React from 'react'
import './Footer.css';
import {Link} from "react-router-dom";
export default function Footer() {
  return (
    <>
      <div className="footer">


        <ul className="fot-links">

          <li className="fot-items"><h3><a href="https://www.linkedin.com/in/ruyyadi-rahul-reddy-026b4a212/">©RUYYADI RAHUL REDDY </a></h3></li>
          <li className="fot-items"><h3><a href="">©</a></h3></li>

        </ul>
        <li className="fot-items1"><h3><Link to="/">Logout</Link></h3></li>
      </div>
    </>
  )
}
