// src/components/TeamList.js
import React from "react";
import TeamCard from "./TeamCard";

const TeamList = ({ teams, handleJoin }) => {
	const availableTeams = teams.filter((team) => team.members.length < 4);

	return (
		<div className="w-screen h-full  px-10 my-6">
			<h2 className="text-4xl font-bold mb-6 text-center text-white">
				Available Teams to Join
			</h2>
			{availableTeams.length === 0 ? (
				<p className="text-center text-xl text-gray-400 ">
					No available teams to join. You can create one!
				</p>
			) : (
				<div className="flex flex-col gap-4 flex-grow">
					{availableTeams.map((team) => (
						<TeamCard key={team.id} team={team} handleJoin={handleJoin} />
					))}
				</div>
			)}
		</div>
	);
};

export default TeamList;
