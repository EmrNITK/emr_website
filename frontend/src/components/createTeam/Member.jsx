export default ({ name, email, inTeam, toggleTeam }) => {
	return (
		<div className="create-team-member">
			<span style={{ fontSize: "1.2rem" }}>{name}</span>
			<span style={{ fontSize: "1.2rem" }}>{email}</span>
			<button onClick={() => toggleTeam(!inTeam)} style={{ width: "6rem" }}>
				{inTeam ? "Remove" : "Add"}
			</button>
		</div>
	);
};
