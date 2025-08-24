import { useRef, useState } from "react";
import { removeMember, addMemberToTeam, getUserById } from "../api/apiService";

const TeamInfo = ({
  team,
  users,
  setTeams,
  setAvailableUsers,
  handleDeleteTeam,
  handleKitProvided,
}) => {
  const dialogRef = useRef(null);
  const [showUsers, setShowUsers] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isKitProvided, setIsKitProvided] = useState(false);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };
  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const availableUsers = () =>
    users.filter(
      (user) =>
        !user.teamId &&
        !user.isAdmin &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleDeleteMember = async (teamId, memberId, isLeader) => {
    if (isLeader) {
      setError("You cannot remove the team leader.");
      setMessage("");
      return;
    }

    setMessage("Removing Member...");
    setError("");
    try {
      const response = await removeMember(teamId, memberId);
      const member = await getUserById(memberId);

      // Update Team state
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

      // Update available users
      setAvailableUsers((prevUsers) => [...prevUsers, member]);

      setMessage(response.message);
      setError("");
    } catch (error) {
      setError(error.message || "Error deleting member.");
      setMessage("");
    }
  };

  const handleAddMember = async (teamId, memberId) => {
    setMessage("Adding Member...");
    try {
      const response = await addMemberToTeam(teamId, memberId);
      const member = await getUserById(memberId);

      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team._id === teamId
            ? {
                ...team,
                members: [...team.members, member],
              }
            : team
        )
      );

      // Update available users
      setAvailableUsers((prevUsers) =>
        prevUsers.filter((user) => !(user._id === memberId))
      );
      setMessage(response.message);
      setError("");
    } catch (error) {
      setError(error.message || "Error adding member.");
      setMessage("");
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 w-full max-w-2xl">
        {/* Team Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2m5 2v-2a3 3 0 00-3-3H7a3 3 0 00-3 3v2m5-6a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{team.name}</h3>
              <p className="text-gray-400 text-sm">Team Management</p>
            </div>
          </div>
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
            onClick={openDialog}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Details
          </button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{team.members?.length || 0}</div>
            <div className="text-sm text-gray-400">Members</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center flex items-center justify-center space-x-2">
            <input
              type="checkbox"
              name="isKitProvided"
              id="kit"
              defaultChecked={team.isKitProvided}
              onChange={(e) => handleKitProvided(team._id, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="kit" className="text-sm text-gray-300 font-medium">
              Kit Provided
            </label>
          </div>
        </div>

        {/* Leader Info */}
        <div className="mb-4 p-4 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-700/30 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-400">👑</span>
            <span className="text-yellow-400 font-semibold">Team Leader</span>
          </div>
          <p className="text-gray-300 ml-6">{team.leader?.name}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            onClick={() => handleDeleteTeam(team._id)}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Team
          </button>
        </div>
      </div>
        {/* Team Details Dialog */}
        <dialog
          className="w-11/12 max-w-4xl mx-auto bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-8 shadow-2xl open:flex flex-col backdrop:bg-black/50 backdrop:backdrop-blur-sm"
          id="dialog"
          ref={dialogRef}
        >
          {/* Dialog Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2m5 2v-2a3 3 0 00-3-3H7a3 3 0 00-3 3v2m5-6a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{team.name}</h1>
                <p className="text-gray-400">Team Details & Management</p>
              </div>
            </div>
            <button
              onClick={closeDialog}
              className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full p-3 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Notifications */}
          {message && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-xl">
              <p className="text-green-400 font-medium">{message}</p>
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700/50 rounded-xl">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Team Members Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2m5 2v-2a3 3 0 00-3-3H7a3 3 0 00-3 3v2m5-6a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
              <span>Team Members ({team.members?.length || 0}/4)</span>
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {team.members?.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{member.name}</p>
                      <p className="text-gray-400 text-sm">{member.rollNo}</p>
                    </div>
                    {member.isLeader && (
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full font-semibold border border-yellow-500/30">
                        Leader
                      </span>
                    )}
                  </div>
                  <button
                    className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300"
                    onClick={() => {
                      handleDeleteMember(team._id, member._id, member.isLeader);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Available Users Section */}
          {team.members?.length < 4 && showUsers && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Available Users</span>
              </h2>
              
              <div className="mb-4">
                <input
                  id="search"
                  type="text"
                  placeholder="Search users by name..."
                  className="w-full bg-gray-800/50 border border-gray-600 px-4 py-3 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {availableUsers().map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <button
                      className="bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300"
                      onClick={() => {
                        handleAddMember(team._id, user._id);
                      }}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dialog Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
            <div className="flex space-x-3">
              {team.members.length < 4 && (
                <button
                  onClick={() => setShowUsers(!showUsers)}
                  className={`${
                    showUsers 
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  } text-white font-semibold px-4 py-2 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showUsers ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    )}
                  </svg>
                  {showUsers ? "Hide Users" : "Add Members"}
                </button>
              )}
            </div>
            <button
              onClick={closeDialog}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
        </dialog>

    </>
  );
};

export default TeamInfo;
