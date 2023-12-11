import React from 'react'
import "./Main.css";
import image2 from "./images/5ShaneWarne-farewell.jpg";

export default function main() {
  return (
    <>
      <div className="Main">
        <img src={image2} className='Mainbackground' alt="" />
        <div className="Matchselector">



          <form id="make_checkbox_select">
            <div className="selectmatch"><h1 className="p">Select Match</h1></div>
             <select className="list1">
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
              <option value="Option 3">Option 3</option>
              <option value="Option 4">Option 4</option>
              <option value="Option 5">Option 5</option>
              <option value="Option length"/>

            </select>

            <input className="list2" type="submit"/>

          </form>

        </div>
      </div>
    </>
  )
}
