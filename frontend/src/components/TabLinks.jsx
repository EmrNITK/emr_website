import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon, path }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(path);
  };

  return (
    <Tilt className="xs:w-[250px] w-full">
      <motion.div
        variants={fadeIn("right", "spring", index * 0.2, 0.6)}
        className="bg-gradient-to-r from-green-400 via-pink-500 to-pink-600 p-[1px] rounded-[20px] shadow-xl cursor-pointer"
        onClick={handleCardClick} // Call the handleCardClick function on click
      >
        <div className="bg-tertiary rounded-[20px] py-1 px-12 min-h-[40px] flex justify-center items-center flex-col">
          <img src={icon} alt={title} className="w-16 h-16 object-contain" />
          <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
        </div>
      </motion.div>
    </Tilt>
  );
};

const TabLinks = () => {
  return (
    <>
      <motion.div variants={textVariant()}></motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-0 text-secondary text-[50px] max-w-6xl leading-[30px]"
      ></motion.p>

      <div className="mt-0 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(TabLinks, "tablinks");
