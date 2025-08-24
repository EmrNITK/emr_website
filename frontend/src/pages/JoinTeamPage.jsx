import React, { useContext, useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import { getAllTeams, joinTeam } from "../api/apiService";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";

const JoinTeamPage = () => {
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
    <PageLayout title={"Join Team"}>
      {user?.teamId ? <Navigate to="/workshop" /> : <></>}
      
      <div className="max-w-6xl mx-auto shadow-2xl rounded-3xl p-8 mt-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg border border-gray-700/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Join a Team
          </h1>
          <p className="text-gray-400 text-lg">Find and join an existing team for the workshop</p>
        </div>

        {/* Notifications */}
        {message && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-400 font-medium">{message}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-700/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-400 font-medium">Sending join request...</p>
            </div>
          </div>
        )}

        {feching ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full animate-spin">
                <div className="absolute inset-2 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="mt-4 text-lg text-gray-300 font-medium">Loading teams...</p>
          </div>
        ) : availableTeams.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <input
                id="search"
                type="text"
                placeholder="Search teams by name..."
                className="w-full max-w-md mx-auto bg-gray-800/50 border border-gray-600 px-4 py-3 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2m5 2v-2a3 3 0 00-3-3H7a3 3 0 00-3 3v2m5-6a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">No Teams Available</h3>
              <p className="text-gray-400">There are currently no teams available to join.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <input
                id="search"
                type="text"
                placeholder="Search teams by name..."
                className="w-full max-w-md mx-auto bg-gray-800/50 border border-gray-600 px-4 py-3 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 block"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto no-scrollbar">
              {availableTeams
                .filter((team) => team.members.length < 4)
                .map((team) => (
                  <TeamCard
                    key={team._id}
                    team={team}
                    handleJoin={handleJoin}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
     
    </PageLayout>
  );
};

export default JoinTeamPage;
