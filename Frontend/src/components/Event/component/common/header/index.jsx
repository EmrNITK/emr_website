import React, { useState } from "react";
import "../../../../../assets/css/eventheader.css";
import { motion } from "framer-motion";



const tabs = [
  {
    id: 1,
    name: "RoboSoccor",
  },
  {
    id: 2,
    name: "Pixar",
  },
  {
    id: 3,
    name: "Simulator",
  },
  {
    id: 4,
    name: "MazeUp",
  },
  {
    id: 5,
    name: "SynthAI",
  },
  {
    id: 6,
    name: "BitCoding",
  }
];

function Header(props) {
  const [isMenu, setisMenu] = useState(true);
  return (
    <div className="header">
      <motion.div
        whileTap={{ scale: 0.75 }}
        onClick={() => {
          setisMenu(!isMenu);
        }}
        className="menu-icon-wrapper"
      >
        <motion.i
          whileTap={{ scale: 0.75 }}
          class="fi fi-sr-calendar-days menu-icon"
        ></motion.i>
      </motion.div>
      {isMenu && (
        <div className="options">
          {/* <div className=""> */}
          {tabs.map((tab) => {
            return (
              <div
                onClick={() => {
                  props.setActiveTab(tab.name);
                  // setisMenu(!isMenu);
                }}
                className={`tab-item cur-po Event_names ${
                  props.activeTab === tab.name && "active-tab"
                }`}
              >
                <div className="tab-name">{tab.name}</div>
              </div>
            );
          })}
          {/* </div> */}
        </div>
      )}
    </div>
  );
}

export default Header;
