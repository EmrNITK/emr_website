import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";

const WorkshopInfo = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch updated user data from the backend
  useEffect(() => {
    const fetchUpdatedUserData = async () => {
      try {
        if (user) {
          await updateUser();
        }
      } catch (error) {
        console.error("Error fetching updated user data:", error);
      }
    };

    fetchUpdatedUserData();
  }, []);

  const handleCreateTeamClick = () => {
    navigate("/workshop/createteam");
  };

  const handleJoinTeamClick = () => {
    navigate("/workshop/jointeam");
  };

  return (
    <div>
      <Header />
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen ">
        <div className=" bg-white/5  backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm rounded-lg overflow-hidden flex flex-col md:flex-row max-w-6xl w-full">
          <div className="p-8 w-full md:w-2/3">
            <h1 className="text-3xl md:text-4xl pt-10 font-bold mb-4">
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
            {/* {Show Manage Team button if user is leader and member in team < 4} */}
            {user?.teamId?.members?.length<4 && user?.isLeader ? (
              <>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <button
                    onClick={handleCreateTeamClick}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-500"
                  >
                    Manage Team
                  </button>
                </div>
              </>
              // {Show both buttons if user doesn't have teamId field}
            ) : !user?.teamId ? (
              <>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <button
                    onClick={handleCreateTeamClick}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-500"
                  >
                    Create Team
                  </button>
                  <button
                    onClick={handleJoinTeamClick}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-500"
                  >
                    Join Team
                  </button>
                </div>
              </>
              // {Show nothing if user has a teamId and isn't leader}
            ) : (
              <></>
            )}
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
