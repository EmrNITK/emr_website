import React, { useEffect, useState, useContext } from "react";
import {
  getTeamById,
  removeMember,
  deleteTeam,
  leaveTeam,
} from "../api/apiService";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import TeamMemberCard from "../components/TeamMemberCard";

const TeamDetailsPage = () => {
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
          console.log(team, "dgd");
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
  const handleLeaveTeam = async () => {
    const teamId = user?.teamId?._id;
    try {
      setLoading(true);
      const response = await leaveTeam(teamId);
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
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-pink-500/30 rounded-full animate-spin">
            <div className="absolute inset-2 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="mt-4 text-lg text-gray-300 font-medium">Loading team details...</p>
      </div>
    );

  return (
    <PageLayout title={"Your Team"}>
      {team ? (
        <>
          <div className="max-w-6xl mx-auto shadow-2xl rounded-3xl p-8 mt-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg border border-gray-700/50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2m5 2v-2a3 3 0 00-3-3H7a3 3 0 00-3 3v2m5-6a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                {team.name}
              </h1>
              <div className="flex items-center justify-center space-x-2 text-lg font-medium text-gray-300">
                <span className="text-yellow-400">👑</span>
                <span>Leader: {team.leader.name}</span>
              </div>
            </div>
            <div>
            {/* WhatsApp Notice */}
            <div className="mb-8 p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-xl backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm text-gray-300">
                  <p className="font-semibold text-green-400 mb-1">Important Notice</p>
                  <p>
                    Make sure all your team members join the{" "}
                    <a
                      className="text-green-400 hover:text-green-300 underline font-medium transition-colors duration-200"
                      href="https://chat.whatsapp.com/Czckjr0oTgh5sT17Q81EUp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp Group
                    </a>{" "}
                    for all workshop updates.
                  </p>
                </div>
              </div>
            </div>

              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 pink-text-gradient">
                  Our Team
                </h2>
                <p className="text-gray-400 text-lg">
                  Meet the creative minds behind our success
                </p>
              </div>
              
              {error && (
                <p className="font-mono text-sm text-center text-red-500 mb-4">
                  {error}
                </p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-h-[60vh] overflow-y-auto no-scrollbar">
                {team.members.map((member, index) => (
                  <TeamMemberCard
                    key={member._id}
                    member={member}
                    user={user}
                    team={team}
                    onRemoveMember={handleDeleteMember}
                    index={index}
                  />
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-10">
                {user.isLeader && (
                  <>
                    {team.members.length <= 3 ? (
                      <Link to="/workshop/createteam">
                        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105">
                          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Members
                        </button>
                      </Link>
                    ) : (
                      <button
                        className="bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 font-semibold px-6 py-3 rounded-xl shadow-lg cursor-not-allowed"
                        onClick={() => alert("Team is already Complete")}
                      >
                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Members
                      </button>
                    )}

                    <button
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                      onClick={handleDeleteTeam}
                    >
                      <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Team
                    </button>
                  </>
                )}
                <button
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
                  onClick={handleLeaveTeam}
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Leave Team
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2m5 2v-2a3 3 0 00-3-3H7a3 3 0 00-3 3v2m5-6a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">No Team Found</h2>
            <p className="text-gray-400 text-lg mb-8">You haven't joined or created a team yet.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/workshop/createteam"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Team
            </Link>
            <Link
              to="/workshop/jointeam"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Join Team
            </Link>
          </div>
        </div>
      )}

      {loading ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-medium">Processing...</p>
          </div>
        </div>
      ) : message ? (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium z-50 animate-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{message}</span>
          </div>
        </div>
      ) : error ? (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium z-50 animate-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      ) : null}
    </PageLayout>
  );
};

export default TeamDetailsPage;
