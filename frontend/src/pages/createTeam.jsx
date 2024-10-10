import React, { useState, useEffect } from "react";
import axios from "axios";

import Member from "../components/createTeam/Member.jsx";

import "./createTeam.css";

export default () => {
	const [users, setUsers] = useState([]);
	const [teamName, setTeamName] = useState("");
	const [disableSelect, setDisableSelect] = useState(false);

	const [selectedMembers, setSelectedMembers] = useState([]); // Array of ids of selected members

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get("/api/users");
				const data = await response.json();
				setUsers(data);
				console.log(response);
			} catch (error) {
				console.error("Error:", error);
			}
		};
		fetchUsers();
	}, []);

	const toggleTeam = (state, id) => {
		if (selectedMembers.length >= 3 && state) {
			return alert("You can't add more than 3 members in a team");
		}

		if (state) {
			setSelectedMembers([...selectedMembers, id]);
		} else {
			setSelectedMembers(selectedMembers.filter((member) => member !== id));
		}
	};

	const createNewTeam = async () => {
		if (teamName.trim() === "") {
			return alert("Please enter a team name");
		}

		try {
			const response = await axios.post("/api/team", {
				name: teamName,
			});
			const data = await response.json();

			await axios.post(`/api/teams/${data._id}`, {
				members: selectedMembers,
			});

			setDisableSelect(true);
			if (selectedMembers.length > 0) {
				setUsers(users.filter((user) => selectedMembers.includes(user._id))); // show list of selected users if selected at all
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="create-team-container">
			<div className="create-team-header">
				<span className="create-team-title">Create Team</span>
				<div className="create-team-input-container">
					<input
						type="text"
						placeholder="Team Name"
						className="create-team-input"
						onChange={(e) => setTeamName(e.target.value)}
					/>
					<button onClick={createNewTeam} disabled={disableSelect}>
						Create
					</button>
				</div>
			</div>
			<div
				className="create-team-select-members"
				style={{
					opacity: disableSelect ? "0.5" : "1",
					pointerEvents: disableSelect ? "none" : "auto",
					userSelect: disableSelect ? "none" : "auto",
				}}
			>
				<span className="create-team-title">
					{disableSelect && selectedMembers.length > 0
						? "Invitations sent"
						: "Select Members"}
				</span>
				<div className="create-team-members-list">
					{users.length > 0 ? (
						users
							.filter((user) => !user.teamId) // Filter out users who are already in a team
							.map((user) => (
								<Member
									key={user._id}
									name={user.name}
									email={user.email}
									inTeam={selectedMembers.includes(user._id)}
									toggleTeam={(state) => toggleTeam(state, user._id)}
								/>
							))
					) : (
						<span>No users available</span>
					)}
				</div>
			</div>
		</div>
	);
};
