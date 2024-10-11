import React, { useState } from "react";
import data from "./data.jsx";
import Workshops from "./WorkshopDetails.jsx";
import NavBar2 from "../Navbar2.jsx";
import "../../assets/css/WorkshopDetail.css";
import StarsCanvas from "../canvas/Stars.jsx";

const WorkshopDetail = () => {
  const [ws, setws] = useState(data);
  function showworkshop(id) {
    const newWorkshops = ws.filter((tour) => tour.id === id);
    setws(newWorkshops);
  }

  return (
    <div className="App">
      <NavBar2 />

      <div className="relative z-0 bg-primary">
        <Workshops ws={ws} showworkshop={showworkshop} />
        <StarsCanvas />
      </div>
    </div>
  );
};

export default WorkshopDetail;
