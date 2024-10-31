import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllTeams, fetchUsers, deleteTeam } from "../api/apiService";
import { Link, useNavigate } from "react-router-dom";
import TeamInfo from "../components/TeamInfo";
import Header from "../components/Header";

const TeamDashboard = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        await updateUser();
        const response = await getAllTeams();
        const users = await fetchUsers();
        setAvailableUsers(users);
        setTeams(response.teams || []);
      } catch (error) {
        setError("Failed to fetch data. Please try again.");
        setMessage("");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!user.isAdmin) {
      navigate("/workshop");
    }
  }, [user, navigate]);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteTeam = async (teamId) => {
    try {
      setMessage("Deleting Team...");
      setError("");

      await deleteTeam(teamId);

      setTeams((prevTeams) => prevTeams.filter((team) => team._id !== teamId));

      setMessage("Team deleted successfully.");
      setError("");
    } catch (err) {
      setError("Error deleting team. Please try again.");
      setMessage("");
      console.error("Error deleting team:", err);
    }
  };

  return (
    <>
    <Header/>
    <div>
      <h1 className="text-4xl font-extrabold text-center text-white-800 mt-4 mb-8">
        Team Dashboard
      </h1>

      {message && <p className="text-green-500 font-mono">{message}</p>}
      {error && <p className="text-red-500 font-mono">{error}</p>}

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by team name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border px-4 py-2 rounded-md border-gray-300 focus:outline-none"
        />
      </div>

      <div className="max-h-[50vh] flex flex-col items-center gap-5">
        {fetching ? (
          <p className="text-green-500 font-mono">Loading...</p>
        ) : filteredTeams.length > 0 ? (
          filteredTeams.map((team) => {
            return (
              <TeamInfo
              key={team._id}
                team={team}
                users={availableUsers}
                setTeams={setTeams}
                setAvailableUsers={setAvailableUsers}
                handleDeleteTeam={handleDeleteTeam}
              />
            );
          })
        ) : (
          <p>No teams available</p>
        )}
      </div>
    </div>
    </>
  );
};

export default TeamDashboard;
