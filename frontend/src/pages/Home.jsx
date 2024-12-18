import React from "react";

import {
  TabLinks,
  Hero,
  Navbar,
  StarsCanvas,

} from "../components";

import Contact from "../components/ContactUs/Contact";
import Footer from "../components/Footer/FooterComp";
import UpcomingWorkshops from "../components/UpcomingWorkshops/UpcomingWorkshops";

export default function Home() {
  return (
        <div className=" bg-cover bg-no-repeat bg-center">
    <div className="h-screen">
      <div className="relative z-0 bg-primary">
          <Navbar />
          <div className="relative  z-0">
            <div  className="relative  bg-hero-pattern bg-cover bg-no-repeat bg-center z-0">
              <Hero />
            </div>
      
        </div>
            <TabLinks />
            {/* <UpcomingWorkshops /> */}
            
            {/* <Contact /> */}

            <Footer />
            <StarsCanvas />
          </div>
      </div>
    </div>
  );
}


// ......
// 
