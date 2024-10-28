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
      <div className="mt-24 md:mt-20 flex flex-col items-center justify-center min-h-screen">
        <div className=" bg-white/5  backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm rounded-lg overflow-hidden flex flex-col md:flex-row max-w-6xl w-full">

          <div className="p-4 w-full md:w-2/3">
            <h1 className="text-3xl md:text-4xl pt-10 font-bold mb-4">
              Embedded Workshop
            </h1>

            <p className="text-sm md:text-normal text-gray-400 mb-6 text-justify font-mono">
            Get ready to dive into the exciting world of Embedded Systems and Robotics! In this hands-on workshop, you'll explore both autonomous robotics and gesture-based control, tailored for all skill levels—from beginners to experienced tech enthusiasts.
            <br />
            <br />
              Build and program your own autonomous robots, including:
              <br />
              - A Line Follower Bot 
              <br />
              - A Hand Gesture-Controlled Bot with an integrated Robotic Arm 🤖
              <br />
              - A Remote-Controlled Bot
              <br />
              - Refreshments provided
              <br />
              - Certificates will be awarded to all participants
              <br /><br />
              <b>📅 Dates:</b> 8th, 9th & 10th November
              📍 <b>Venue:</b> MCA Block
              <br /><br />
              <b>Amount ( Bot Kit Price ) </b>: ₹ 1700 / Member
              <br />
              <br />
              <b className="text-green-500 text-sm md:text-lg">Yes! The kit will be all yours to keep...</b>
              <br /><br />
              <p className="text-xs text-justify font-serif">
                <u><a href="https://drive.google.com/file/d/105syjkUKCgF9ShWTHpxLUM-ksaDehA-y/view?usp=sharing" target="_blank">Click to know Steps To Register</a></u>

              </p>
            </p>
            <div className="w-full flex md:hidden min-h-[30vh] md:w-1/2 p-4 justify-center items-center">
              <img
                src={bot}
                alt="Embedded Workshop"
                className="object-cover mb-4 min-h-[20vh] w-3/4 md:h-full md:w-3/4 rounded-md boxShadoww"
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
