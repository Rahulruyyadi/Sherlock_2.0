import React from 'react'
import "./Main3.css"
import image4 from "./images/6d651177668aac152e9ddabf6a81a8e623dd03086edd5d1b9472a30db98e7a67a9245726f7a993abc3d2dab286789c1d292ddb9e3fb92e5d601873_1280.jpg";
export default function Main3() {
    return (
        <>
            <div className="Main2">
                <img src={image4} className='Mainbackground2' alt="" />
                <div className="Teamselector">
                    <form id="make_checkbox_select3">
                    <div className="selectplayingXI"> <h1 className="p2">Select Playing XI</h1></div>
                        <select className="Playerlist1">

                            <option className='option' data-count="2" value="India">India</option>
                            <option className='option' data-count="23" value="England">England</option>
                            <option className='option' data-count="32" value="New Zealand">New Zealand</option>
                            <option className='option' data-count="3" value="Australia">Australia</option>
                            
                        </select>

                        <input className="Playerlist2" type="submit" />

                    </form>

                </div>
            </div>
        </>

    )
}
