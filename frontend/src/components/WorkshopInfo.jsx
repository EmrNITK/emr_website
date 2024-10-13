import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header'; 

const WorkshopInfo = () => {
  return (
    <div>
      <Header />
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen ">
        <div className=" bg-white/5  backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm rounded-lg overflow-hidden flex flex-col md:flex-row max-w-6xl w-full">
          <div className="p-8 w-full md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Embedded Workshop
            </h1>
            <p className="text-sm md:text-lg text-gray-400 mb-6 text-justify font-mono">
              The Embedded Systems Workshop is an interactive, hands-on training
              designed to introduce participants to the fundamentals of embedded
              systems. It covers essential topics such as microcontrollers,
              sensors, interfacing techniques, and real-time programming.
              Participants gain practical experience by working on real-world
              projects, learning how to design and implement embedded solutions
              effectively.
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
