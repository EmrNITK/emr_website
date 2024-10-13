import React, { useState, useEffect ,useContext} from "react";
import "./createTeam.css";
import { createTeam, fetchUsers, sendInvitation } from "../api/apiService.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default () => {
	const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [disableSelect, setDisableSelect] = useState(false);

  const [selectedMembers, setSelectedMembers] = useState([]); // Array of ids of selected members

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getUsers();
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
      const response = await createTeam(tea);
      console.log("response from createTeam()", response);
      const teamId = response.team._id;
      await sendInvitation(teamId, selectedMembers);
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
			  <h1>Create Team</h1>
			  <form action="">
				  <label htmlFor="teamname">Team Name:</label>
				  <input type="text" id="teamname"/>
				  <button type="submit">Create</button>
			  </form>
			  </div>
		 </div>
   
  );
};
