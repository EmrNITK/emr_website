import React from "react";

const TeamCard = ({ team, handleJoin }) => {
  return (
    <div className=" grid place-items-start lg:col-span-4  lg:grid-cols-subgrid lg:content-center lg:place-items-center lg:justify-items-center bg-white/5  backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm p-3 rounded-lg shadow-lg">
      <div className="text-lg font-semibold text-white-500 mb-2 lg:mb-0 l">
        {team.name}
      </div>
      <div className="mb-4 lg:mb-0 ">
        {team.members.length === 0 ? (
          <p className="text-gray-800">No members yet.</p>
        ) : (
          <i className="text-sm list-disc list-inside text-gray-400  ">
            {team.leader?.email}
          </i>
        )}
      </div>
      <p className="font-sans text-sm text-white-750 mb-4 lg:mb-0">
        Members: {team.members.length} / 4
      </p>
      <button
        onClick={() => handleJoin(team._id)}
        className={`text-sm px-4 py-2 rounded-full text-white ${
          team.members.length >= 4
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        } transition duration-200`}
        disabled={team.members.length >= 4 || team.joinRequestPending}
      >
        {team.members.length >= 4 ? "Full" : "Join"}
      </button>
    </div>
  );
};

export default TeamCard;
