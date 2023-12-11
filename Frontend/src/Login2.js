import React from 'react'
import './Login2.css';
import image1 from './images/favicon.jpg';
export default function Login2() {
  return (
    <>
    <div className="login2">
      <img src={image1} className='background1' alt="" />
      <div className="lafooter2">

        <form className="form2">
          <h2 className="form-heading">OTP</h2>
          <input type="text" className="form-control" placeholder="Enter OTP" />
          <button className="btn-submit2">Submit</button>
        </form>

      </div>
    </div>
  </>
  )
}
