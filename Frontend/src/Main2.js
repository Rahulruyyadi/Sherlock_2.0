import React from 'react'
import "./Main2.css"
import image3 from "./images/6d651177668aac152e9ddabf6a81a8e623dd03086edd5d1b9472a30db98e7a67a9245726f7a993abc3d2dab286789c1d292ddb9e3fb92e5d601873_1280.jpg";
export default function Main2() {
    return (
        <>
            <div className="Main2">
                {/* <img src={image3} className='Mainbackground2' alt="" /> */}
                <div className="Teamselector">
                    <form id="make_checkbox_select2">
                    <div className="selectteam"><h1 className="p3">Select Team</h1></div>
                        <select className="Teamlist1">

                            <option className='option' data-count="2" value="India">India</option>
                            <option className='option' data-count="23" value="England">England</option>

                        </select>

                        <input className="Teamlist2" type="submit" />

                    </form>

                </div>
            </div>
        </>
    )
}
