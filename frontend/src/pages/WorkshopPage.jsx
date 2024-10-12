import React from "react";
import WorkshopHead from "../components/WorkshopPage/WorkshopHead";
import CurrentWorkshop from "../components/WorkshopPage/CurrentWorkshop";
import NavBar2 from "../components/Navbar2";
function WorkshopPage() {
  return (
    <>
      <NavBar2 />
      <CurrentWorkshop />
      <WorkshopHead />
    </>
  );
}

export default WorkshopPage;
