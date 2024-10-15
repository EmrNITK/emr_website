// src/components/TeamList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import TeamCard from "./TeamCard";
import Header from "./Header";
const API_BASE_URL = import.meta.env.API_BASE_URL;
const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/teams/`, {
          withCredentials: true, // Include cookies if needed
        });
        setTeams(response.data.teams);
      } catch (error) {
        setMessage("Failed to fetch teams. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Handle joining a team
  const handleJoin = async (teamId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/teams/${teamId}/join/`,
        {},
        { withCredentials: true }
      );
      setMessage(response.data.message);
      // Optionally, update the teams list to reflect the new member
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === teamId
            ? {
                ...team,
                members: [...team.members /* user ID or user object */],
              }
            : team
        )
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to join the team. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const availableTeams = teams.filter((team) => team.members.length < 4);

  return (
    <>
      <Header />
      <div className="w-screen h-full px-10 my-6 mt-20">
        <h2 className="text-4xl font-bold mb-6 text-center text-white">
          Available Teams to Join
        </h2>
        {loading && (
          <p className="text-center text-xl text-gray-400">Loading...</p>
        )}
        {!loading && availableTeams.length === 0 ? (
          <p className="text-center text-xl text-gray-400 ">
            No available teams to join. You can create one!
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-4 flex-grow overflow-auto">
            {availableTeams.map((team) => {
              if (team.members.length < 4) {
                return (
                  <TeamCard
                    key={team._id}
                    team={team}
                    handleJoin={handleJoin}
                  />
                );
              }
            })}
          </div>
        )}
        {message && (
          <p className="mt-4 text-center text-green-500">{message}</p>
        )}
      </div>
    </>
  );
};

export default TeamList;
