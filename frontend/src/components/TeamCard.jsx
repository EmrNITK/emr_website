import React, { useState } from "react";


const TeamCard = ({ team, handleJoin }) => {
	const [message, setMessage] = useState("");
	console.log("TEAM",team)

	return (
		<div className="bg-white p-3 rounded-lg shadow-lg">
			<div className="flex flex-row justify-between">
				<h3 className="text-lg font-semibold text-red-500 mb-2">
					{team.name}
				</h3>
				<div className="mb-4">
					<h4 className=" text-sm font-semibold text-black">Team Leader email:</h4>
					{team.members.length === 0 ? (
						<p className="text-gray-500">No members yet.</p>
					) : (
						<ul className="text-sm list-disc list-inside text-purple-950 ">
							{team.leader?.email}
						</ul>
					)}
				</div>
				<p className="text-sm text-gray-600 mb-4">Members: {team.members.length} / 4</p>
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
					} transition duration-200`}
					disabled={team.members.length >= 4 || team.joinRequestPending}
				>
					{team.members.length >= 4 ? "Full" : "Join"}
				</button>
			</div>
		</div>
	);
};

export default TeamCard;
