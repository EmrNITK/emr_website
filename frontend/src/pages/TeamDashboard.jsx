import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllTeams, deleteTeam, removeMember } from "../api/apiService";
import { Link, useNavigate } from "react-router-dom";

const TeamDashboard = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setFetching(true);
        await updateUser();
        const response = await getAllTeams();
        setTeams(response.teams || []);
      } catch (error) {
        setError("Failed to fetch teams. Please try again.");
        setMessage("");
      } finally {
        setFetching(false);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    if (!user.isAdmin) {
      navigate("/workshop");
    }
  }, [user, navigate]);

  const handleDeleteTeam = async (teamId) => {
    try {
      await deleteTeam(teamId);
      setTeams((prevTeams) => prevTeams.filter((team) => team._id !== teamId));
      setMessage("Team deleted successfully.");
      setError("");
    } catch (err) {
      setError("Error deleting team. Please try again.");
      console.error("Error deleting team:", err);
    }
  };

  const handleDeleteMember = async (teamId, memberId, isLeader) => {
    if (isLeader) {
      setError("You cannot remove the team leader.");
      return;
    }

    setLoading(true);
    try {
      const response = await removeMember(teamId, memberId);
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team._id === teamId
            ? {
                ...team,
                members: team.members.filter(
                  (member) => member._id !== memberId
                ),
              }
            : team
        )
      );
      setMessage(response.message);
      setError("");
    } catch (error) {
      setError(error.message || "Error deleting member.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mt-10 mb-8">
        Team Dashboard
      </h1>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by team name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
      </div>

      <div className="min-h-[100vh] flex flex-col items-center">
        {fetching ? (
          <p>Loading...</p>
        ) : filteredTeams.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-600 text-white">
                <th className="border border-gray-300 p-4 text-left">Team</th>
                <th className="border border-gray-300 p-4 text-left">Leader</th>
                <th className="border border-gray-300 p-4 text-left">
                  Members
                </th>
                <th className="border border-gray-300 p-4 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team) => (
                <tr key={team._id} className="border-b border-gray-300">
                  <td className="border border-gray-300 p-4">{team.name}</td>
                  <td className="border border-gray-300 p-4">
                    <div>
                      <span className="font-semibold text-lg text-gray-500">
                        Name:
                      </span>{" "}
                      {team.leader?.name}
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-gray-500">
                        College:
                      </span>{" "}
                      {team.leader?.collegeName}
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-gray-500">
                        Roll:
                      </span>{" "}
                      {team.leader?.rollNo}
                    </div>
                  </td>
                  <td className="border border-gray-300 p-4">
                    <ul className="list-disc pl-5">
                      {team.members.map((member) => (
                        <li
                          key={`${team._id}-${member._id}`}
                          className="relative group"
                        >
                          <div>
                            <span className="font-semibold text-lg text-gray-500">
                              Name:
                            </span>{" "}
                            {member.name}
                            <div>
                              <span className="font-semibold text-lg text-gray-500">
                                Roll:
                              </span>{" "}
                              {member.rollNo}
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              handleDeleteMember(
                                team._id,
                                member._id,
                                member._id === team.leader._id // Check if the member is the leader
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white text-xs rounded-md px-2 py-1 absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            {loading ? "Removing..." : "Remove"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 p-4 text-center">
                    <>
                      {team.members.length < 4 ? (
                        <Link to="/workshop/createteam">
                          <button className="bg-green-500 hover:bg-green-600 rounded-md text-xs md:text-base font-semibold mx-1 md:mx-2 px-3 md:px-4 py-1 md:py-2">
                            Add Members
                          </button>
                        </Link>
                      ) : (
                        <button
                          className="bg-gray-500 rounded-md text-xs md:text-base font-semibold mx-1 md:mx-2 px-3 md:px-4 py-1 md:py-2"
                          onClick={() => alert("Team is already complete")}
                        >
                          Add Members
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteTeam(team._id)}
                        className="bg-red-500 hover:bg-red-600 rounded-md text-xs md:text-base font-semibold mx-1 md:mx-2 px-3 md:px-4 py-1 md:py-2"
                      >
                        Delete Team
                      </button>
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No teams available</p>
        )}
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default TeamDashboard;
