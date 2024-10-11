import React from "react";
import "../../../../assets/css/winner.css";
import Slider from "react-slick";
// import NextArrow from "../common/carousel/nextArrow";
// import PrevArrow from "../common/carousel/prevArrow";
import { motion } from "framer-motion";
const settings = {
  infinite: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  // nextArrow: <NextArrow />,
  // ...
  // prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

function Winners({ list }) {
  return (
    <div className="collection-wrapper">
      <div className="max-width collection">
        <div className="collection-title"> Winners</div>
        <Slider {...settings}>
          {list.map((item) => (
            <motion.div whileHover={{ scale: 1.1 }}>
              <div className="collection-cover">
                <img src={item.cover} className="collection-image"></img>
                <div className="gradiant-bg"></div>
                <div className="collection-card-title">{item.title}</div>
                <div className="collection-card-subtitle">
                  <div>({item.Position})</div>
                </div>
              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Winners;
