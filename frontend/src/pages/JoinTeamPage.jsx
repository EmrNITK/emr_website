// src/components/TeamList.js
import React, { useContext, useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import Header from "../components/Header";
import { getAllTeams, joinTeam } from "../api/apiService";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const TeamList = () => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { teams } = await getAllTeams();
        console.log(teams);
        setTeams(teams);
      } catch (error) {
        setError("Failed to fetch teams. Please try again.");
        setMessage("");
      } finally {
        setLoading(false);
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

  const availableTeams = teams.filter((team) => team.members.length < 4);

  return (
    <>
      {user?.teamId ? <Navigate to="/workshop" /> : <></>}
      <Header />
      <div className="w-screen h-full px-10 my-6 mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Available Teams to Join
        </h2>

        {!loading && availableTeams.length === 0 ? (
          <p className="text-center text-xl text-gray-400 ">
            No available teams to join. You can create one!
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-grow overflow-auto">
            {availableTeams.map((team) => {
              return (
                <TeamCard key={team._id} team={team} handleJoin={handleJoin} />
              );
            })}
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
