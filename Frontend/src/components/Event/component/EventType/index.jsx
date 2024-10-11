import React from "react";
import "../../../../assets/css/eventtype.css";
import About from "../common/About Events";
import Winners from "../Winners/winners";
import ImageSection from "../common/Image_Section";

function Event({ contentitems, WinnersList, Images }) {
  return (
    <div className="common-background">
      <div className="max-width about-wrapper">
        <div className="flex-container">
          <div className="flex-item-left">
            <About
              heading={contentitems.heading}
              content={contentitems.content}
            ></About>
          </div>
          <div className="flex-item-right">
            <div className="images">
              <ImageSection slides={Images}></ImageSection>
            </div>
          </div>
        </div>
        {/* <Winners list={WinnersList}></Winners> */}
      </div>
    </div>
  );
}

export default Event;
