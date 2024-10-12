import React, { useState } from "react";
import "../../assets/css/WorkshopDetail.css";

function Bullet({ id, name, info }) {
  const [hover, setHover] = useState(false);
  const descriptionDetails = hover ? info : "";

  function hoverHandler() {
    const temp = setTimeout(() => {}, 1000);
    setHover(true);
    return () => clearTimeout(temp);
  }

  function outHoverHandler() {
    const temp = setTimeout(() => {}, 1000);
    setHover(false);
    return () => clearTimeout(temp);
  }

  return (
    <div
      className="ca"
      onMouseEnter={hoverHandler}
      onMouseLeave={outHoverHandler}
    >
      <div className="workshop_card">
        <div className="workshop_wrap">
          <h4 className="workshop_text" contenteditable data-text={name}>
            {name}
          </h4>
        </div>
      </div>

      <div className="disc">
        <p className="workshop_details"> {descriptionDetails}</p>
      </div>
    </div>
  );
}

export default Bullet;
