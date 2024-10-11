// src/pages/TeamsPage.js
import React, { useState, useEffect } from "react";
import TeamList from "../components/TeamList";
import axios from "axios";

//for dummy data
// import { TeamData } from "../pages/TeamData";

const TeamsPage = () => {

	// getting data from backend
	const [teams, setTeams] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	
	useEffect(() => {
		const fetchTeams = async () => {
			try {
				const response = await axios.get("http://localhost:5000/api/teams");
				// console.log("Fetched Teams:", response.data);
				const data = await response.json();
				setTeams(data);
			} catch (error) {
				console.error("Error fetching teams:", error);
				setError(error);
			}
		};
		fetchTeams();
	}, []);


	const handleJoin = async (teamId) => {
		setLoading(true);
		setError(null);
		try {
			const response = await axios.post(
				`http://localhost:5000/api/teams/${teamId}/join_request`
			);

			// Update local state to reflect the pending request
			setTeams(
				teams.map((team) => {
					if (team.name === teamId) {
						return {
							...team,
							joinRequestPending: true, // You might want to show this in UI
						};
					}
					return team;
				})
			);

			// Optionally show success message
			console.log("Join request sent successfully");
		} catch (err) {
			setError(err.response?.data?.message || "Failed to send join request");
			console.error("Join request error:", err);
		} finally {
			setLoading(false);
		}
	};


	// for testing purposes, we will use the TeamData class to get the initial data

	// const [teams, setTeams] = useState(TeamData.getInitialData());
	// useEffect(() => {
	// 	TeamData.saveTeams(teams);
	// }, [teams]);

	// useEffect(() => {
	// 	const savedTeams = TeamData.loadTeams();
	// 	setTeams(savedTeams);
	// }, []);

	// const handleJoin = (teamId, member) => {
	// 	setTeams(
	// 		teams.map((team) => {
	// 			if (team.name === teamId && team.members.length < 4) {
	// 				return { ...team, members: [...team.members, member] };
	// 			}
	// 			return team;
	// 		})
	// 	);
	// };
	

	return (
		<div>
			<TeamList teams={teams} handleJoin={handleJoin} />
		</div>
	);
};

export default TeamsPage;
