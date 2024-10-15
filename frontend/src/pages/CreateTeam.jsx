import React, { useState, useEffect, useContext } from "react";
import { createTeam, fetchUsers, sendInvitation } from "../api/apiService.js";
import { AuthContext } from "../context/AuthContext.jsx";
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";

const CreateTeam = () => {
  const { user: loggedInUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [disableSelect, setDisableSelect] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [selectedMembers, setSelectedMembers] = useState([]); // Array of ids of selected members

  useEffect(() => {
    const getUsers = async () => {
      try {
        console.log(loggedInUser);
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

  const createNewTeam = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (teamName.trim() === "") {
      return alert("Please enter a team name");
    }

    try {
      const response = await createTeam(teamName);
      console.log(response, response.ok);
      console.log("response from createTeam()", response);
      const teamId = response.team._id;
      console.log("team id", teamId);
      console.log("selected members", selectedMembers);
      await sendInvitation(teamId, selectedMembers);
    } catch (err) {
      console.error(err);
      alert(err.message)
      setError(err.message || "An error occurred during team creation.");
    } finally {
      setLoading(false);
      navigate("/teamdetails");
    }
  };

  const getAvaialbeUsers = () => {
    return users.filter(
      (user) => !(user._id == loggedInUser?._id || user.teamId)
    );
  };

  return (
    <>
      <Header />
      <section class="w-full lg:w-4/5 mx-auto px-4 py-8 flex flex-col items-center justify-between p-4 gap-y-8 mt-12">
        <h1 class="text-2xl font-bold">Create Team</h1>
        <form class="w-full flex gap-4 flex-col justify-between">
          <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <label
              class="block text-xl font-large text-white-700"
              for="team-name"
            >
              Team
            </label>
            <input
              id="team-name"
              type="text"
              placeholder="Enter team name"
              class="bg-transparent border-b border-gray-300 focus:outline-none w-full lg:w-2/5"
              onChange={(e) => {
                console.log(e.target.value);
                setTeamName(e.target.value);
              }}
            />
          </div>

          <div class="w-full lg:w-4/5 border border-white rounded-xl p-2 m-0 grid grid-cols-[auto,1fr,1fr] gap-4 overflow-auto ">
            {getAvaialbeUsers().length ? (
              getAvaialbeUsers().map((user) => {
                return (
                  <div
                    key={user._id}
                    className={`col-span-3 grid grid-cols-subgrid gap-4 justify-items-start p-2 m-0`}
                  >
                    <input
                      type="checkbox"
                      className="w-auto col-start-1 col-end-2"
                      onClick={(e) => {
                        toggleTeam(e.target.checked, user._id);
                      }}
                    />
                    <div
                      id="name"
                      className="text-xs lg:text-lg flex-grow col-start-2 col-end-3"
                    >
                      {user.name}
                    </div>
                    <div
                      id="email"
                      className="text-xs lg:text-lg flex-grow col-start-3 col-end-4"
                    >
                      {user.email}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-red-400 bold-text">No available users</div>
            )}
          </div>
          <button
            type="submit"
            onClick={createNewTeam}
            class="bg-white text-[#050816] rounded-xl hover:bg-transparent hover:text-white border hover:border-[$fff] p-2 w-full lg:w-4/5"
            disabled={loading}
          >
            {loading ? "Creating Team..." : "Create Team"}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </section>
    </>
  );
};

export default CreateTeam;
