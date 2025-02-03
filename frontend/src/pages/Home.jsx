import React from "react";

// import { TabLinks, Hero, Navbar, StarsCanvas } from "../components";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TabLinks from "../components/TabLinks";
import Footer from "../components/Footer";
import StarsCanvas from "../components/Stars";

export default function Home() {
  return (
    <div className=" bg-cover bg-no-repeat bg-center">
      <div className="h-screen">
        <div className="relative z-0 bg-primary">
          <Navbar />
          <div className="relative  z-0">
            <div className="relative  bg-hero-pattern bg-cover bg-no-repeat bg-center z-0">
              <Hero />
            </div>
          </div>
          <TabLinks />
          <Footer />
          <StarsCanvas />
        </div>
      </div>
    </div>
  );
}
