import React, { useEffect, useState, useContext } from "react";
import { getTeamById } from "./api/apiService";
import { AuthContext } from "./context/AuthContext";
import Header from "./components/Header";

const TeamDetails = ({ teamId }) => {
  const { user: updateUser } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const data = await getTeamById(updateUser.teamId?.toString());
        setTeam(data.team);
      } catch (err) {
        setError(err.message || "Error fetching team details");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [updateUser.teamId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-blue-600">
        Loading team details...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto shadow-lg rounded-lg p-6 mt-8">
        {/* Added margin-top to separate the header from the content */}
        <div className="flex flex-col mb-4">
          <h1 className="text-3xl font-bold text-blue-700">
            Team: {team.name}
          </h1>
          <p className="text-lg font-semibold text-gray-800">
            Leader: {team.leader ? team.leader.name : "No leader assigned"}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white-900 mb-4">
            Team Members:
          </h3>
          <ul className="space-y-3">
            {team.members.map((member) => (
              <li
                key={member._id}
                className="flex items-center justify-between p-4 bg-white/5  backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm font-bold text-xl rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-blue-600">{member.name}</span>
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
                {/* Additional member-specific actions can be added here */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
