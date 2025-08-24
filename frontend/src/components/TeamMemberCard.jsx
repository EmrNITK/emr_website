import React from 'react';

const TeamMemberCard = ({ member, user, team, onRemoveMember, index = 0 }) => {
  const isCurrentUser = member.rollNo === user.rollNo;
  const isLeader = team.leader._id === member._id;
  const canRemove = user.isLeader && !isCurrentUser;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const generateProfileColor = (name) => {
    // Generate a consistent color based on the name
    const colors = [
      'from-pink-500 to-purple-600',
      'from-blue-500 to-indigo-600',
      'from-green-500 to-emerald-600',
      'from-yellow-500 to-orange-600',
      'from-purple-500 to-pink-600',
      'from-indigo-500 to-blue-600',
      'from-emerald-500 to-green-600',
      'from-orange-500 to-red-600'
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div
      className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:scale-105 transform transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Profile Image */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${generateProfileColor(member.name)} p-0.5`}>
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold text-white">
              {getInitials(member.name)}
            </div>
          </div>
          
          {/* Status Badges */}
          {isCurrentUser && (
            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-semibold">
              You
            </div>
          )}
          {isLeader && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs px-2 py-1 rounded-full font-semibold">
              Leader
            </div>
          )}
        </div>
      </div>

      {/* Member Info */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors duration-300">
          {member.name}
        </h3>
        
        <div className="text-sm text-gray-300 space-y-1">
          <p className="text-gray-400 truncate" title={member.email}>
            {member.email}
          </p>
          <div className="flex justify-between text-xs">
            <span className="text-blue-400 truncate" title={member.branch}>
              {member.branch || "N/A"}
            </span>
            <span className="text-green-400">
              {member?.year ?? "N/A"}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate" title={member.collegeName}>
            {member.collegeName}
          </p>
          <p className="text-xs text-gray-400">Roll: {member.rollNo}</p>
        </div>
      </div>

      {/* Remove Button for Leader */}
      {canRemove && (
        <div className="absolute top-3 right-3">
          <button
            className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full p-2 text-xs transition-all duration-300 backdrop-blur-sm"
            onClick={() => onRemoveMember(member._id)}
            title="Remove member"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default TeamMemberCard;
