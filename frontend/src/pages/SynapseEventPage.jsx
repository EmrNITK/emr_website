import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import FooterComp from "../components/Footer/FooterComp";

const SynapseEventPage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [active, setActive] = useState(1);

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

  return (
    <div>
      <Header />

      <section className="min-h-[100vh] p-4 flex flex-col items-center gap-10">
        <div>
          <h1 className="text-2xl md:text-4xl text-center text-white-800 font-mono">
          Welcome to Synapse!!
          </h1>{" "}
          <p className="text-center text-slate-300 font-mono text-xl">
            Season 1 [Ep. 1]
          </p>
        </div>

        <div className="w-full md:w-[80%] grid grid-cols-4 justify-items-center bg-white/10 backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm rounded-2xl">
          <div
            className={`w-full text-center text-xs text-nowrap md:text-base p-2 rounded-2xl ${
              active == 1 ? "bg-white/20" : ""
            }`}
            onClick={() => setActive(1)}
          >
            {" "}
            Details
          </div>
          <div
            className={`w-full text-center text-xs text-nowrap md:text-base p-2 rounded-2xl ${
              active == 2 ? "bg-white/20" : ""
            }`}
            onClick={() => setActive(2)}
          >
            Rulebook
          </div>
          <div
            className={`w-full text-center text-xs text-nowrap md:text-base p-2 rounded-2xl ${
              active == 3 ? "bg-white/20" : ""
            }`}
            onClick={() => setActive(3)}
          >
            Profile
          </div>
          <div
            className={`w-full text-center text-xs text-nowrap md:text-base p-2 rounded-2xl ${
              active == 4 ? "bg-white/20" : ""
            }`}
            onClick={() => setActive(4)}
          >
            Submit{" "}
          </div>
        </div>
        <div className="w-full md:w-[60%] text-center md:text-left  bg-white/5 backdrop-opacity-100 backdrop-brightness-100 shadow-lg backdrop-blur-lg rounded-3xl">
          {active == 1 ? (
            <div className="flex flex-col">
              <div className="flex md:justify-around md:flex-row flex-col py-6">
                <div>
                  <h3 className="font-mono text-xl md:text-3xl ">Details</h3>
                  <p className="font-mono text-left text-sm p-4 md:w-[fit-content]">
                    <ul className="list-inside font-mono flex flex-col gap-2 *:font-mono *:text-base">
                      <li>Platform: Kaggle</li>
                      <li>
                        Link:{" "}
                        <a
                          href="https://www.kaggle.com/"
                          className="text-blue-400 underline"
                        >
                          Contest
                        </a>
                      </li>
                      <li>Launch Date: Jan 11, 2025 (09:00 AM)</li>
                      <li>End Date: Jan 17, 2025 (07:00 PM)</li>
                    </ul>
                  </p>
                </div>
                <div>
                  <h3 className="font-mono text-xl md:text-3xl">✨Prizes🌟</h3>
                  <p className="font-mono text-left text-sm p-4 ">
                    <ul className="list-inside font-mono flex flex-col gap-2 *:font-mono *:text-base">
                      <li>💸 Cash Prize : ₹ 3000 /- </li>
                      <li className="text-nowrap">⭐ Top 10: E-certificates</li>
                    </ul>
                  </p>
                </div>
              </div>
              <p className="font-mono text-green-400 text-left text-sm p-4 ">
                Note: You will be added in the competetion after 07:00 PM &
                after that you can access it via{" "}
                <a
                  href="https://www.kaggle.com/"
                  className="text-blue-400 underline"
                >
                  link
                </a>
              </p>
            </div>
          ) : active == 2 ? (
            <div className="text-center py-4">
              <h3 className="font-mono text-xl text md:text-3xl ">Rulebook</h3>
              <p className="font-mono text-left text-base p-4 md:w-[fit-content]">
                You can access rule book from here:
                <a
                  href="https://www.kaggle.com/"
                  className="text-blue-400 underline"
                >
                  Rule book
                </a>
              </p>
            </div>
          ) : active == 3 ? (
            <div className="p-4">
              <h3 className="font-mono text-xl md:text-3xl ">Profile</h3>
              <p className="font-mono text-left text-sm p-4 md:w-[fit-content]">
                <ul className="list-inside font-mono flex flex-col gap-2 *:font-mono *:text-base">
                  <li>Name: {user.name}</li>
                  <li>Roll No: {user.rollNo}</li>
                  <li> Email: {user.email}</li>
                  <li>
                    Kaggle Link:{" "}
                    <a href={`https://www.kaggle.com/${user.kaggleUserName}`} className="text-blue-400 underline">
                      {user.kaggleUserName}
                    </a>
                  </li>
                </ul>
              </p>
            </div>
          ) : active == 4 ? (
            <div className="text-center py-4">
              <h3 className="font-mono text-xl text md:text-3xl ">Submission Form</h3>
              <p className="font-mono text-left text-base p-4 md:w-[fit-content]">
                Thank you for participating!! <br />
                You can submit your solution by filling the Submission form: <br />
                <a
                  href="https://www.kaggle.com/"
                  className="text-blue-400 underline"
                >
                  Submission Form
                </a>
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </section>

      <FooterComp />
    </div>
  );
};

export default SynapseEventPage;
