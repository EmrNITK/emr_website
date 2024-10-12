import React from "react";
import "../../../../../assets/css/eventsimagesection.css";
// import data from "./data.json";
import ImageSlider from "../Slider/imageSlider";
const ImageSection = ({ slides }) => {
  return (
    <div className="max-width wrapper">
      <div className="image-heading">
        <span className="image-sub-heading">Photo</span> Gallery
      </div>
      {/* <div className="image-slider"> */}
      <ImageSlider slides={slides} />
      {/* </div> */}
    </div>
  );
};

export default ImageSection;
