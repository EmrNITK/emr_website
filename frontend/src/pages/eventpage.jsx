import React, { useState } from "react";
import Header from "../components/Event/component/common/header";
import NavBar2 from "../components/Navbar2";
import "../assets/css/header-test.css";

import Event from "../components/Event/component/EventType";

import {
  robosoccor,
  pixar,
  bitcoding,
  mazeup,
  simulator,
  robosoccorWinners,
  pixarWinners,
  mazeupWinners,
  simulatorWinners,
  bitcodingWinners,
  robosoccorimages,
  pixarimages,
  bitcodingimages,
  mazeupimages,
  simulatorimages,
  synthai,
  synthaiWinners,synthaiimages
} from "../../data.js";

function EventPage() {
  const [activeTab, setActiveTab] = useState("RoboSoccor");
  return (
    <div>
      <NavBar2 />
      <div className="header-bg">
        <Header activeTab={activeTab} setActiveTab={setActiveTab}></Header>
        {getCorrectScreen(activeTab)}
      </div>
    </div>
  );
}
const getCorrectScreen = (tab_name) => {
  switch (tab_name) {
    case "RoboSoccor":
      return (
        <Event
          contentitems={robosoccor}
          WinnersList={robosoccorWinners}
          Images={robosoccorimages}
        ></Event>
      );
    case "Pixar":
      return (
        <Event
          contentitems={pixar}
          WinnersList={pixarWinners}
          Images={pixarimages}
        ></Event>
      );
    case "Simulator":
      return (
        <Event
          contentitems={simulator}
          WinnersList={simulatorWinners}
          Images={simulatorimages}
        ></Event>
      );
    case "MazeUp":
      return (
        <Event
          contentitems={mazeup}
          WinnersList={mazeupWinners}
          Images={mazeupimages}
        ></Event>
      );
    case "BitCoding":
      return (
        <Event
          contentitems={bitcoding}
          WinnersList={bitcodingWinners}
          Images={bitcodingimages}
        ></Event>
      );
    case "SynthAI":
      return (
        <Event
          contentitems={synthai}
          WinnersList={synthaiWinners}
          Images={synthaiimages}
        ></Event>
      );
    default:
      return (
        <Event
          contentitems={robosoccor}
          WinnersList={robosoccorWinners}
          Images={robosoccorimages}
        ></Event>
      );
  }
};
export default EventPage;
