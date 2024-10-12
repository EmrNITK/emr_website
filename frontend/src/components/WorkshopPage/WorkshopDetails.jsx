import React from "react";
import Bullet from "./Bullet.jsx";
import "../../assets/css/WorkshopDetail.css";

const Workshops = ({ ws }) => {
  return (
    <div className="workshop_container">
      <div className="workshop_title">
        <h1 data-text="WORKSHOPS">WORKSHOPS</h1>
      </div>

      <div className="workshop_cards">
        {ws.map((workshop) => {
          return <Bullet key={workshop.id} {...workshop} />;
        })}
      </div>
    </div>
  );
};

export default Workshops;
