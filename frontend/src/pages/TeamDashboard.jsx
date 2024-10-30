import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllTeams, deleteTeam, removeMember } from "../api/apiService";
import { Link, useNavigate } from "react-router-dom";

const TeamDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (updateUser.isAdmin) {
      navigate("/workshop");
    }
  }, [updateUser, navigate]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getAllTeams();
        setTeams(response.teams || []);
      } catch (err) {
        console.log("Error fetching teams:", err);
      }
    };

    fetchTeams();
  }, [updateUser]);

  const handleDeleteTeam = async (teamId) => {
    try {
      await deleteTeam(teamId);
      setTeams((prevTeams) => prevTeams.filter((team) => team._id !== teamId));
    } catch (err) {
      console.log("Error deleting team:", err);
    }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    try {
      await removeMember(teamId, memberId);
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
    } catch (err) {
      console.log("Error removing member:", err);
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
        {filteredTeams.length > 0 ? (
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
                      <span className="font-semibold text-lg text-purple-700">
                        Name:
                      </span>{" "}
                      {team.leader?.name}
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-purple-700">
                        College:
                      </span>{" "}
                      {team.leader?.collegeName}
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-purple-700">
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
                            <span className="font-semibold text-lg text-blue-700">
                              Name:
                            </span>{" "}
                            {member.name}
                            <div>
                              <span className="font-semibold text-lg text-purple-700">
                                Roll:
                              </span>{" "}
                              {member.rollNo}
                            </div>
                          </div>
                        
                              <button
                                onClick={() =>
                                  handleRemoveMember(team._id, member._id)
                                }
                                className="bg-red-500 hover:bg-red-600 text-white text-xs rounded-md px-2 py-1 absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              >
                                Remove
                              </button>
                            
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 p-4 text-center">
                    <>
                      {team.members.length <= 3 ? (
                        <Link to="/workshop/createteam">
                          <button className="bg-green-500 hover:bg-green-600 rounded-md text-xs md:text-base font-semibold mx-1 md:mx-2 px-3 md:px-4 py-1 md:py-2">
                            Add Members
                          </button>
                        </Link>
                      ) : (
                        <button
                          className="bg-gray-700 rounded-md text-xs md:text-base font-semibold mx-1 md:mx-2 px-3 md:px-4 py-1 md:py-2"
                          onClick={() => alert("Team is already Complete")}
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
      </div>
    </div>
  );
};

export default TeamDashboard;
