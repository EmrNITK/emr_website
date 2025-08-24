import React from "react";

const TeamCard = ({ team, handleJoin }) => {
  return (
    <div className="group bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:scale-105 transform transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
      {/* Team Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2m5 2v-2a3 3 0 00-3-3H7a3 3 0 00-3 3v2m5-6a3 3 0 110-6 3 3 0 010 6z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
              {team.name}
            </h3>
            <p className="text-sm text-gray-400">
              {team.members.length}/4 members
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          team.members.length >= 4
            ? "bg-red-500/20 text-red-400 border border-red-500/30"
            : "bg-green-500/20 text-green-400 border border-green-500/30"
        }`}>
          {team.members.length >= 4 ? "Full" : "Available"}
        </div>
      </div>

      {/* Team Leader */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-400">👑</span>
          <span className="text-sm font-medium text-gray-300">Leader:</span>
        </div>
        <div className="pl-6">
          <p className="text-sm text-gray-400 truncate" title={team.leader?.email}>
            {team.leader?.email || "No leader assigned"}
          </p>
        </div>
      </div>

      {/* Join Button */}
      <button
        onClick={() => handleJoin(team._id)}
        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform ${
          team.members.length >= 4
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
        }`}
        disabled={team.members.length >= 4 || team.joinRequestPending}
      >
        <div className="flex items-center justify-center space-x-2">
          {team.members.length >= 4 ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
              <span>Team Full</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Join Team</span>
            </>
          )}
        </div>
      </button>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default TeamCard;
