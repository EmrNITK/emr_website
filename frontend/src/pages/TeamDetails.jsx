import React, { useEffect, useState, useContext } from "react";
import { getTeamById, removeMember, deleteTeam } from "../api/apiService";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import FooterComp from "../components/Footer/FooterComp";

const TeamDetails = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
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
        console.log(err);
      } finally {
        setFetching(false);
      }
    };

    fetchTeamDetails();
  }, []);

  const handleDeleteMember = async (memberId) => {
    const teamId = user?.teamId?._id;

    try {
      setLoading(true);
      const response = await removeMember(teamId, memberId);
      setTeam((prevTeam) => ({
        ...prevTeam,
        members: prevTeam.members.filter((member) => member._id !== memberId),
      }));
      setMessage(response.message);
      setError("");
    } catch (error) {
      console.error(error);
      setError(error.message || "An error occurred during deleting member.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    const teamId = user?.teamId?._id;
    try {
      setLoading(true);
      const response = await deleteTeam(teamId);
      setTeam(null);
      setMessage(response.message);
      setError("");
    } catch (error) {
      console.error(error);

      setError(error.message || "An error occurred during deleting team.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex items-center justify-center h-screen text-blue-600">
        Loading team details...
      </div>
    );

  return (
    <div>
      <Header />
      <div className="min-h-[100vh]">
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
                <h3 className="text-xl font-bold text-white-900 mb-4 ">
                  Team Members:
                </h3>
                {!error && (
                  <p className="font-mono text-sm text-center text-red-500">
                    {error}
                  </p>
                )}
                <ul className="space-y-3 overflow-y-auto max-h-[50vh]">
                  {team.members.map((member) => (
                    <li
                      key={member._id}
                      className="flex flex-col md:flex-row md:justify-between gap-4  p-4 bg-white/5  backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm font-bold text-xl rounded-lg transform transition-transform duration-300 hover:shadow-lg"
                    >
                      <div className="flex flex-col items-start justify-start">
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
                          Year: {member?.year ?? "Not provided"}
                        </span>
                        <span className="text-gray-600 font-normal text-xs">
                          College: {member.collegeName}
                        </span>
                        <span className="text-gray-600 font-normal text-xs">
                          Roll No: {member.rollNo}
                        </span>
                      </div>

                      <div className=" self-start md:self-end items-center">
                        {user.isLeader && user.rollNo != member.rollNo && (
                          <button
                            className="bg-red-500 hover:bg-red-600 rounded-md text-xs md:text-base  font-semibold px-4 sm:px-1 py-2 md:px-4 md:py-2"
                            onClick={() => handleDeleteMember(member._id)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-start items-center mt-10">
                  {user.isLeader && (
                    <>
                      {team.members.length <= 3 ? (
                        <Link to="/workshop/createteam">
                          <button className="bg-green-500 hover:bg-green-600 rounded-md text-xs md:text-base  font-semibold mx-1 md:mx-4 px-4 sm:px-1 py-2 md:px-4 md:py-2">
                            Add Members
                          </button>
                        </Link>
                      ) : (
                        <button
                          className="bg-gray-700  rounded-md text-xs md:text-base  font-semibold mx-1 md:mx-4 px-4 sm:px-1 py-2 md:px-4 md:py-2"
                          onClick={() => alert("Team is already Complete")}
                        >
                          Add Members
                        </button>
                      )}

                      <button
                        className="bg-red-500 hover:bg-red-600 rounded-md text-xs md:text-base  font-semibold mx-1 md:mx-4 px-4 sm:px-1 py-2 md:px-4 md:py-2"
                        onClick={handleDeleteTeam}
                      >
                        Delete Team
                      </button>
                    </>
                  )}
                </div>
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

        {loading ? (
          <p className="font-mono text-sm text-center text-green-500">
            Removing...
          </p>
        ) : message ? (
          <p className="font-mono text-sm text-center text-green-500">
            {message}
          </p>
        ) : (
          <></>
        )}
      </div>
      <FooterComp />
    </div>
  );
};

export default TeamDetails;
