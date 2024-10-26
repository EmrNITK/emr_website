import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import FooterComp from "../components/Footer/FooterComp";
import bot from "../assets/workshop_bot.png";

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
      <div className="mt-20 md:mt-5 flex flex-col items-center justify-center min-h-screen">
        <div className=" bg-white/5  backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm rounded-lg overflow-hidden flex flex-col md:flex-row max-w-6xl w-full">
          
          <div className="p-4 w-full md:w-2/3">
            <h1 className="text-3xl md:text-4xl pt-10 font-bold mb-4">
              Embedded Workshop
            </h1>
            
            <p className="text-sm md:text-normal text-gray-400 mb-6 text-justify font-mono">
              <b>🌟 What to Expect: </b>
              Prepare to immerse yourself in the exciting world of Embedded Systems and Robotics, where you’ll explore both autonomous robotics and gesture-based control. Whether you're a beginner or an experienced tech enthusiast, this workshop is crafted for all skill levels!
              <br />
              <br />
              🔥<b>Workshop Highlights:</b>
              - Build and program your own Autonomous Line Follower Bot and your own bot operated by Hand Gestures, featuring an integrated Robotic Arm
              - Master hand gesture recognition to control a bot
              - Learn in-depth hardware implementation and control systems
              - Ideal for both beginners and advanced participants
              <br /><br />
              <b>📅 Dates:</b> 8th, 9th & 10th November
              📍 <b>Venue:</b> MCA Block
              <br /><br />
              <b>Amount ( Bot Kit Price ) </b>: ₹ 1700 
              <br />
              <br />
              <b className="text-green-500 text-lg">Yes! The kit is all yours to keep...</b>

            </p>
            <div className="w-full flex md:hidden md:w-1/2 p-4 justify-center items-center">
            <img
              src={bot}
              alt="Embedded Workshop"
              className="object-cover mb-4 h-[20vh] w-3/4 md:h-full md:w-3/4 rounded-md boxShadoww"
            />
          </div>
            {/* {Show Manage Team button if user is leader and member in team < 4} */}
            {user?.teamId?.members?.length < 4 && user?.isLeader ? (
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
          <div className="w-full hidden md:w-1/2 p-4 md:flex justify-center items-center">
            <img
              src={bot}
              alt="Embedded Workshop"
              className="object-cover  md:h-[50vh] md:w-full rounded-md boxShadoww"
            />
          </div>

        </div>
      </div>
      <FooterComp />
    </div>
  );
};

export default WorkshopInfo;
