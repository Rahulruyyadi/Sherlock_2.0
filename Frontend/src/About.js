import React from 'react'
import './About.css';
import img2 from "./images/pencil.jpg";

export default function About() {
    return (
        <div className="About">
            <img src={img2} alt="" className="img2" />

            <h1 className="About1">Welcome to Sherlock! We are excited to see you here . Do you think you have good deduction skills?
                Then why don't you apply them ? Yes , now it's possible to apply your deduction skills !. Predict your
                playing XI in cricket matches and see yourself where you standout among others.
            </h1>

        </div>
    )
}
