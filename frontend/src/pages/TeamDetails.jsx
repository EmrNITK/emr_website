import React, { useEffect, useState, useContext } from "react";
import { getTeamById, removeMember, deleteTeam } from "../api/apiService";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import { Link } from "react-router-dom";

const TeamDetails = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        await updateUser();
        if (user.teamId) {
          const { team } = await getTeamById(user?.teamId?._id);
          setTeam(team);
        }
      } catch (err) {
        setError(err.message || "Error fetching team details");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, []);

  const handleDelete = async (teamId, _id) => {
    setTeam((prevTeam) => ({
      ...prevTeam,
      members: prevTeam.members.filter((member) => member._id !== _id),
    }));
    removeMember(teamId)
  }
  const handleDeleteTeam = async (teamId) => {
    console.log(teamId)
    deleteTeam(teamId)
  }


  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-blue-600">
        Loading team details...
      </div>
    );

  return (
    <div>
      <Header />

      {team ? (
        <>
          <div className="max-w-2xl mx-auto shadow-lg rounded-lg p-6 mt-20">
            <div className="flex flex-col mb-4">
              <h1 className="text-3xl font-bold text-blue-700">
                Team: {team.name}
              </h1>
              <i className="text-lg font-sans flex items-center justify-center font-semibold text-white-100">
                Leader: {team.leader.name}
              </i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white-900 mb-4">
                Team Members:
              </h3>
              <ul className="space-y-3">
                {team.members.map((member) => (
                  <li
                    key={member._id}
                    className="flex items-center justify-between p-4 bg-white/5  backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm font-bold text-xl rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="block md:flex justify-center md:justify-end items-center">
                      <div className="flex flex-col">
                        <span className="font-bold text-blue-600">
                          {member.name}
                        </span>
                        <span className="text-gray-500 font-semibold text-sm">
                          Email: {member.email}
                        </span>
                        <span className="text-gray-600 font-normal text-xs">
                          Branch: {member.branch}
                        </span>
                        <span className="text-gray-600 font-normal text-xs">
                          College: {member.collegeName}
                        </span>
                        <span className="text-gray-600 font-normal text-xs">
                          Roll No: {member.rollNo}
                        </span>
                      </div>
                      <div className="md:hidden flex justify-center items-center mt-4 md:justify-end">
                        {user.isLeader && user.rollNo != member.rollNo &&
                          <button
                            className="bg-red-500 hover:bg-red-600 rounded-md text-xs md:text-base  font-semibold mx-1 md:mx-4 px-4 sm:px-1 py-2 md:px-4 md:py-2"

                            // className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-bold text-sm"
                            onClick={() => handleDelete(member.teamId, member._id)}
                          >
                            Delete Member
                          </button>

                        }
                      </div>
                      {/* Additional member-specific actions can be added here */}
                    </div>
                    <div className="md:flex hidden justify-center items-center mt-4 md:justify-end">
                      {user.isLeader && user.rollNo != member.rollNo &&
                        <button
                          className="bg-red-500 hover:bg-red-600 rounded-md text-xs md:text-base  font-semibold mx-1 md:mx-4 px-4 sm:px-1 py-2 md:px-4 md:py-2"

                          // className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-bold text-sm"
                          onClick={() => handleDelete(member.teamId, member._id)}
                        >
                          Delete Member
                        </button>

                      }
                    </div>
                  </li>
                ))}
              </ul>
              <div className="md:flex hidden justify-center items-center mt-4 md:justify-end"></div>
              {user.isLeader &&
                <>
                  
                    {team.members.length <=3 ?
                    <Link
                    to="/workshop/createteam"
                  >
                      <button
                      className="bg-green-500 hover:bg-green-600 rounded-md text-xs md:text-base  font-semibold mx-1 md:mx-4 px-4 sm:px-1 py-2 md:px-4 md:py-2"

                      // className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-bold text-sm"
                      onClick={() => handleDelete(member.teamId, member._id)}
                    >
                      Add Members
                    </button>
                    </Link>
                     :
                    <button
                    className="bg-gray-700  rounded-md text-xs md:text-base  font-semibold mx-1 md:mx-4 px-4 sm:px-1 py-2 md:px-4 md:py-2"

                    // className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-bold text-sm"
                    onClick={() => alert("Team is already Complete")}
                  >
                    Add Members
                  </button>
                  }
                  {/* <Link
                    to="/workshop"
                  > */}

                  <button
                    className="bg-red-500 hover:bg-red-600 rounded-md text-xs md:text-base  font-semibold mx-1 md:mx-4 px-4 sm:px-1 py-2 md:px-4 md:py-2 mb-4"
                    
                    // onClick={() => handleDeleteTeam(user?._id)}
                    >
                    Delete Team
                  </button>
                    {/* </Link> */}

                </>

              }
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col text-center justify-center w-full mt-20 h-[80vh] ">
          <div className="text-center text-red-500">No Team Found</div>
          <div className="text-center">
            <div>
              <Link
                to="/workshop/createteam"
                className="text-blue-500 hover:text-white text-sm underline"
              >
                Create Team
              </Link>
            </div>
            <div>
              <Link
                to="/workshop/jointeam"
                className="text-blue-500 hover:text-white text-sm underline"
              >
                Join Team
              </Link>
            </div>
          </div>
        </div>
      )}
      {message && (
        <p className="font-mono text-sm mt-4 text-center text-green-500">
          {message}
        </p>
      )}
      {error && (
        <p className="font-mono text-sm mt-4 text-center text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default TeamDetails;
