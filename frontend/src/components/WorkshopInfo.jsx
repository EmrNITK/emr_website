import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header'; 

const WorkshopInfo = () => {
  return (
    <div>
      <Header />

      <div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-[#1d1b2f]">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row max-w-6xl w-full">
          <div className="p-8 w-full md:w-2/3"> 
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Embedded Workshop</h1>
            <p className="text-sm md:text-lg text-gray-700 mb-6">
              Join us for an immersive Embedded Systems workshop! Whether you're a beginner or a tech enthusiast, this session will introduce you to Embedded C, Microcontrollers, and Arduino with real-world applications.
              <br />
              💡 Hands-on Experience: Dive straight into practical projects, where you'll design, program, and troubleshoot embedded systems. You’ll get to work on two exciting projects that bring your concepts to life!
              <br /><br />
              ✨ Workshop Highlights:
              <br /> - Learn Embedded C and microcontroller programming.
              <br /> - Explore Arduino and sensor integration.
              <br /> - Build real-world projects to strengthen your skills.
              <br /> Don't miss this chance to enhance your knowledge and build powerful embedded systems!
            </p>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <Link to="/create-team" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-500">
                Create Team
              </Link>
              <Link to="/join-team" className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-500">
                Join Team
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/3 p-4 flex justify-center items-center"> 
            <img
              src="https://images.pexels.com/photos/7869091/pexels-photo-7869091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Embedded Workshop"
              className="object-cover h-64 w-full md:h-full md:w-full rounded-md" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopInfo;
