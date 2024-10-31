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
      <div className="mt-12 md:mt-10 flex flex-col items-center justify-center min-h-screen">
        <div className=" bg-white/5  backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm rounded-lg overflow-hidden flex flex-col md:flex-row max-w-6xl w-full">
          <div className="p-4 w-full md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Embedded Workshop
            </h1>

            <section className="text-xs md:text-sm text-gray-400 mb-6 text-justify font-mono">
              <div className="font-mono">
                EmR is again back with its Embedded Workshop! Don't miss the
                chance; register asap as we have limited seats.
              </div>
              <br />
              <article className="font-mono">
                <h2 className="text-xl font-bold font-mono">
                  Workshop Highlights
                </h2>
                <ul className="list-disc list-inside font-mono flex flex-col gap-2 list-outside px-4">
                  <li className="font-mono">
                    <strong className="font-mono underline">
                      Autonomous Labyrinth Solver
                    </strong>
                    : <br />
                    Developed using the Arduino Uno microcontroller and infrared
                    (IR) sensors for distance measurement. The project
                    integrates hardware with software algorithms to navigate and
                    solve a maze efficiently, minimizing completion time.
                  </li>
                  <li className="font-mono">
                    <strong className="font-mono underline">
                      Hand Gesture-Controlled Bot with an Integrated Robotic Arm
                      🤖:
                    </strong>
                    <br />
                    Constructed with the Arduino Nano microcontroller, NRF24L01
                    transceiver, and ADXL345 gyro sensor for angle detection.
                    The robotic arm is controlled via joystick inputs, allowing
                    intuitive gesture-based navigation and control.
                  </li>
                  <li>
                    <strong className="font-mono underline">Remote-Controlled Bot</strong>
                  </li>
                  <li className="font-mono">
                    <strong className="font-mono">
                      Refreshments will be provided.
                    </strong>
                  </li>
                  <li className="font-mono">
                    <strong className="font-mono">
                      Certificates will be awarded to all participants.
                    </strong>
                  </li>
                </ul>
              </article>

              <br />
              <aside className="font-mono">
                <div className="font-mono">
                  <strong>📅 Dates:</strong> 8th November Onwards
                </div>
                <div className="font-mono">
                  <strong>📍 Venue:</strong> MCA Block
                </div>
              </aside>

              <br />
              <section className="font-mono">
                <h2 className="text-xl font-mono font-bold">
                  Fee Details
                </h2>
                <ul className="list-none space-y-4 font-mono">
                  <li>
                    <h4 className="text-sm font-mono">
                      For NIT Kurukshetra Students:
                    </h4>
                    <ul className="list-disc list-inside ml-4 font-mono">
                      <li className="font-mono">
                        <strong className="font-mono">Amount (Bot Kit Price):</strong> ₹ 1700 / Member
                      </li>
                    </ul>
                  </li>

                  <li>
                    <h4 className="text-sm font-mono">
                      For Other College Students:
                    </h4>
                    <ul className="list-disc list-inside ml-4 font-mono">
                      <li className="font-mono">
                        <strong className="font-mono">Amount (Bot Kit Price):</strong> ₹ 1700 / Member
                      </li>
                      <li className="font-mono">
                        <strong className="font-mono">Accommodation + Food (For 3 Days):</strong> ₹
                        1500 / Member
                      </li>
                    </ul>
                  </li>
                </ul>
              </section>

              <br />
              <div className="text-green-500 text-xl font-bold md:text-xl font-mono">
                Yes! The kit will be all yours to keep...
              </div>

              <br />
              <footer className="font-mono">
                <div className="font-mono text-xl font-bold">
                  Useful Links:
                </div>
                <ul className="list-disc list-inside font-mono">
                  <li>
                    <a
                      href="https://drive.google.com/file/d/1EuMd9CGrhDzJ0gMqni90xFAnUL_Rm0fi/view?usp=drivesdk"
                      target="_blank"
                      className="font-mono text-sky-400 underline"
                    >
                      Brochure
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://drive.google.com/file/d/105syjkUKCgF9ShWTHpxLUM-ksaDehA-y/view?usp=sharing"
                      target="_blank"
                      className="font-mono text-sky-400 underline"
                    >
                      Click to know Steps To Register
                    </a>
                  </li>
                </ul>
                <br />
                <address className="font-mono">
                  <div className="font-mono text-xl font-bold">Queries:</div>
                  <div className="font-mono">Sujal: +91 81687 51825</div>
                  <div className="font-mono">Shivam: +91 6201 512 130</div>
                </address>
              </footer>
            </section>

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
            ) : // {Show both buttons if user doesn't have teamId field}
            !user?.teamId ? (
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
            ) : (
              // {Show nothing if user has a teamId and isn't leader}
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
