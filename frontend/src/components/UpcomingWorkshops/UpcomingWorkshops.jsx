import "../../assets/css/UpcomingWorkshop.css";
import React from "react";
import pic2 from "../../assets/emb_2024.jpg";
// import pic1 from "../../assets/images/bit_coding.jpg";
// import pic3 from "../../assets/images/maze_up.jpg";
// import pic4 from "../../assets/images/simulator.jpg";
// import pic5 from "../../assets/images/robo_soccer.jpg";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

const UpcomingWorkshops = () => {
  return (
    <div className="upcoming_workshop_block">
      <h1 className="glitch">
        <span aria-hidden="true">Current Event</span>
        {/* Upcoming Event */}
        Current Event
        <span aria-hidden="true"></span>
      </h1>
{/* 
------------------ use {below} code  when not any Upcoming Event ------------------
*/}

{/* <h1>Soon . . .</h1> */}

{/* 
------------------ use {above} code  when not any Upcoming Event ------------------
*/}




<a href="https://www.emrnitkkr.com/workshop"><img alt="Bit_Coding" className="module_border_wrap " src={pic2} width="500" height="1000"></img></a>
      {/* <div className="Image_Boxes">
        <div className="module">
          <a href="https://forms.gle/GH3S5rTzicJxdzye7">
            <img alt="Bit_Coding" className="module_border_wrap " src={pic2} width="500" height="1000"></img>
          </a>
          <a href="https://forms.gle/2jp2svw8CnA66j9F7">
            <img alt="Maze_Up" className="module_border_wrap " src={pic3} width="500" height="1000"></img>
          </a>
          <a href="https://forms.gle/FLKboELcz37nA4hV9">
            <img alt="Robo_Soccer" className="module_border_wrap " src={pic5} width="500" height="1000"></img>
          </a>
          <a href="https://forms.gle/cjsPSYQ76PyZaoQ98">
            <img alt="Simulator" className="module_border_wrap " src={pic4} width="500" height="500"></img>
          </a>
          <a href="https://forms.gle/nXQr6D9x8Lg1jMb97">
          <img alt="Upcoming workshop4" className="module_border_wrap " src={pic1} width="500" height="1000"></img>
          </a>
        </div>
      </div> */}
    </div>
  );
};

export default UpcomingWorkshops;
