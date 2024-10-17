// src/components/TeamList.js
import React, { useContext, useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import Header from "../components/Header";
import { getAllTeams, joinTeam } from "../api/apiService";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const TeamList = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [feching, setFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setFetching(true);
        await updateUser();
        const { teams } = await getAllTeams();
        console.log(teams);
        setTeams(teams);
      } catch (error) {
        setError("Failed to fetch teams. Please try again.");
        setMessage("");
      } finally {
        setFetching(false);
      }
    };

    fetchTeams();
  }, []);

  // Handle joining a team
  const handleJoin = async (teamId) => {
    setError("");
    setLoading(true);
    try {
      const response = await joinTeam(teamId);
      console.log(response);
      setMessage(response.message);
      setError("");
    } catch (error) {
      console.log(error);
      setError(error.message || "Failed to join the team. Please try again.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const availableTeams = teams.filter(
    (team) =>
      team.members.length < 4 &&
      team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {user?.teamId ? <Navigate to="/workshop" /> : <></>}
      <Header />
      <div className="w-screen h-full px-10 my-6 mt-24">
        <h2 className="text-2xl pt-12 font-bold mb-6 text-center text-white">
          Available Teams to Join
        </h2>
        {message && (
          <p className="font-mono text-sm mt-4 text-center mb-4 text-green-500">
            {message}
          </p>
        )}

        {feching ? (
          <div className="text-center font-mono text-red-400 font-bold">
            Loading Teams...
          </div>
        ) : availableTeams.length === 0 ? (
          <p className="text-center text-xl text-gray-400 ">
            No available teams to join. You can create one!
          </p>
        ) : (
          <div className="w-full md:w-[60vw] lg:w-[80vw] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 flex-grow overflow-y-auto max-h-[60vh]">
            <div className="col-span-full mx-6 my-2">
              <input
                id="search"
                type="text"
                placeholder="Search by Name"
                className="bg-transparent border px-4 py-2 rounded-md border-gray-300 focus:outline-none w-full"
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              />
            </div>
            {availableTeams.map((team) => {
              return (
                <>
                  <TeamCard
                    key={team._id}
                    team={team}
                    handleJoin={handleJoin}
                  />
                </>
              );
            })}
          </div>
        )}
        {error && (
          <p className="font-mono text-sm mt-4 text-center text-red-500">
            {error}
          </p>
        )}
        {loading && (
          <p className="font-mono text-sm mt-4 text-center text-white">
            Sending Join Request....
          </p>
        )}
      </div>
    </>
  );
};

export default TeamList;
