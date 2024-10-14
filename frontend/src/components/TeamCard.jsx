import React, { useState } from "react";


const TeamCard = ({ team, handleJoin }) => {
	const [message, setMessage] = useState("");
	console.log("TEAM",team)

	return (
		<div className=" col-span-4 grid grid-cols-subgrid justify-items-start bg-white/5  backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm p-3 rounded-lg shadow-lg">
			
				<h3 className="text-lg font-semibold text-white-500 mb-2">
					{team.name}
				</h3>
				<div className="mb-4">
					<h4 className=" text-sm  text-white-300">Team Leader email:</h4>
					{team.members.length === 0 ? (
						<p className="text-gray-800">No members yet.</p>
					) : (
						<ul className="text-sm list-disc list-inside text-gray-600  ">
							{team.leader?.email}
						</ul>
					)}
				</div>
				<p className="text-sm text-white-750 mb-4 justify-self-center">Members: {team.members.length} / 4</p>
				{message && (
					<div className="bg-green-100 text-green-700 p-2 rounded mb-2">
						{message}
					</div>
				)}
				<button
					onClick={() => handleJoin(team._id)}
					className={`text-sm h-10 px-4 rounded-3xl text-white ${
						team.members.length >= 4
							? "bg-gray-400 cursor-not-allowed"
							: "bg-blue-500 hover:bg-blue-600"
					} transition duration-200 justify-self-center`}
					disabled={team.members.length >= 4 || team.joinRequestPending}
				>
					{team.members.length >= 4 ? "Full" : "Join"}
				</button>
			
		</div>
	);
};

export default TeamCard;
