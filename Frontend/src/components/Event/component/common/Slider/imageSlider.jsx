import React, { useState } from "react";
import "../../../../../assets/css/eventsimageslider.css";
import { motion } from "framer-motion";
const ImageSlider = ({ slides }) => {
  const [currentIndex, setcurrentIndex] = useState(0);

  const slideLength = slides.length;
	// console.log(slideLength);

  const rightArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
    right: "32px",
    fontSize: "45px",
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
  };

  const leftArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
    left: "32px",
    fontSize: "45px",
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
  };

  const sliderStyles = {
    height: "100%",
    position: "relative",
  };
  const slideStyles = {
    width: "396px",
    height: "100%",
    borderRadius: "10px",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundImage: `url(${slides[currentIndex % slideLength].url})`,
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setcurrentIndex(newIndex % slideLength);
  };
  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setcurrentIndex(newIndex % slideLength);
  };
  const goToSlide = (slideIndex) => {
    setcurrentIndex(slideIndex % slideLength);
  };
  const slideStylesWidthBackground = {
    ...slideStyles,
    backgroundImage: `url(${slides[currentIndex % slideLength].url})`,
  };
  const dotsContainerStyles = {
    display: "flex",
    justifyContent: "center",
  };

  const dotStyle = {
    margin: "0 3px",
    cursor: "pointer",
    fontSize: "20px",
  };
  let x;
  return (
    <div style={sliderStyles}>
      <div>
        <div onClick={goToPrevious} style={leftArrowStyles}>
          ❰
        </div>
        <div onClick={goToNext} style={rightArrowStyles}>
          ❱
        </div>
      </div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        style={slideStylesWidthBackground}
      ></motion.div>
      <div style={dotsContainerStyles}>
        {slides.map((slide, slideIndex) => (
          <motion.div
            whileTap={{ scale: 0.75 }}
            style={dotStyle}
            key={slideIndex % slideLength}
            onClick={() => goToSlide(slideIndex % slideLength)}
          >
            ●
          </motion.div>
        ))}
      </div>
      {/* {setTimeout(() => {
        {
          goToNext();
        }
      }, 5000)} */}
      {/* {setInterval(() => goToNext(), 10000)} */}
    </div>
  );
};

export default ImageSlider;
