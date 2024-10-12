import React from 'react'
// import FacultyCard from "../components/Faculty/FacultyCard"
import Card from '../components/Team/Card'
import Card2 from '../components/Team/Card2'
import NavBar2 from '../components/Navbar2';
import {
    StarsCanvas,
  
  } from "../components";


function TeamPage() {
    return (


        
        // <div>
        // {/* <   div className='title'>Faculty InCharge</div> */}
        //         {/* <FacultyCard /> */}
        //     <div className='title'>Present Team</div>
        //         <Card />
        //         <StarsCanvas/>
        // </div>

<div>

        <NavBar2 />
        <div className="relative z-0 bg-primary">
            <Card2 />
            <Card />
        {/* <Navbar /> */}
          {/* <UpcomingWorkshops /> */}
          {/* <Contact /> */}

          <StarsCanvas />
        </div>
</div>

    );
}

export default TeamPage;