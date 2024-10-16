import React, { useState, useEffect, useContext } from "react";
import {
  createTeam,
  fetchUsers,
  getTeamById,
  sendInvitation,
} from "../api/apiService.js";
import { AuthContext } from "../context/AuthContext.jsx";
import Header from "../components/Header.jsx";
import { useNavigate, Link, Navigate } from "react-router-dom";

const CreateTeam = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [team, setTeam] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedMembers, setSelectedMembers] = useState([]); // Array of ids of selected members

  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await fetchUsers();
        setVerifiedUsers(users);

        if (user?.teamId?._id) {
          const { team } = await getTeamById(user.teamId._id);
          console.log(team);
          setTeam(team);
          setTeamName(team.name);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getUsers();
  }, []);

  const toggleTeam = (state, id) => {
    if (selectedMembers.length >= 3 && state) {
      setError("Can't add more than 3 members");
      setMessage("");
      return;
    }

    if (state) {
      setSelectedMembers([...selectedMembers, id]);
    } else {
      setSelectedMembers(selectedMembers.filter((member) => member !== id));
    }
  };

  const createNewTeam = async (e) => {
    e.preventDefault();

    if (teamName.trim() === "") {
      setError("Please enter team name.");
      setMessage("");
      return;
    }

    setLoading(true);
    try {
      const response = await createTeam(teamName);
      const teamId = response.team._id;
      console.log(teamId);
      const updatedUser = { ...user, teamId };
      updateUser(updatedUser);
      setMessage("Team created successfully");
      setError("");
      if (selectedMembers.length > 0) {
        await sendInvitation(teamId, selectedMembers);
        setMessage("Invitations sent successfully");
        setError("");
        return;
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "An error occurred during team creation.");
      setMessage("");
    } finally {
      setLoading(false);
      setSelectedMembers([]);
    }
  };

  const getAvailableUsers = () => {
    const available = verifiedUsers.filter(
      (verifiedUser) => !(verifiedUser._id === user._id || verifiedUser.teamId)
    );

    return available;
  };

  const sendInvitations = async (e) => {
    e.preventDefault();
    if (!(selectedMembers.length > 0)) {
      setError("Select user(s) to invite");
      setMessage("");
      return;
    }
    setLoading(true);
    try {
      const teamId = team._id;

      const response = await sendInvitation(teamId, selectedMembers);

      if (response.alreadyInTeam) {
        {
          const msg = "Following users are already in a team ";
          let members = "";
          response.alreadyInTeam.forEach((member) => {
            members += `  ${member.name}-(${member.email})`;
          });
          setError(msg + members);
          setMessage("");
        }
      } else {
        setMessage("Invitations sent successfully!!");
        setError("");
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "An error occurred during team creation.");
      setMessage("");
    } finally {
      setSelectedMembers([]);
      setLoading(false);
    }
  };
  return (
    <>
      {/* Redirect if user has a teamId but isn't leader or team has >=4 members */}
      {(user.teamId && !user.isLeader) || team.members?.length >= 4 ? (
        <Navigate to="/workshop" replace />
      ) : (
        <></>
      )}
      <Header />
      <br />
      <br />
      <br />

      
      {!user.teamId ? (
        <>
          <section className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 pt-16 grid grid-rows-[auto,1fr] grid-cols-[auto,1fr,auto] items-center justify-between  gap-y-6 mt-120">
            <h1 className="text-2xl pt-12 font-bold text-center col-span-3">
              Create Team
            </h1>
            <form className="col-start-2 col-end-3 w-full gap-y-4 grid">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <label
                  className="block text-xl font-large text-white-700"
                  htmlFor="team-name"
                >
                  Team
                </label>
                <input
                  id="team-name"
                  type="text"
                  placeholder="Enter team name"
                  className="bg-transparent border-b border-gray-300 focus:outline-none w-full lg:w-2/5"
                  onChange={(e) => {
                    setTeamName(e.target.value);
                  }}
                />
              </div>

              <div className=" border border-white rounded-xl p-2 m-0 grid grid-cols-[auto,1fr,1fr] gap-4 overflow-y-auto max-h-[50vh]">
                {getAvailableUsers().length ? (
                  getAvailableUsers().map((user) => {
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
                  <div className="col-span-3 text-center font-mono text-red-400 bold-text">
                    No available users
                  </div>
                )}
              </div>
              <button
                type="submit"
                onClick={createNewTeam}
                className="bg-white text-[#050816] rounded-xl hover:bg-transparent hover:text-white border hover:border-[$fff] p-2  "
                disabled={loading}
              >
                {loading ? "Creating Team..." : "Create Team"}
              </button>
            </form>
          </section>
          {error && (
            <p className="font-mono text-sm mt-4 text-red-500 text-center">
              {error}
            </p>
          )}
          {message && (
            <div className="text-center">
              <p className="font-mono text-sm mt-4 text-green-500">{message}</p>
            </div>
          )}
        </>
      ) : (
        <>
          <section className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 py-16  grid grid-rows-[auto,1fr] grid-cols-[auto,1fr,auto] items-center justify-between p-4 gap-y-6 mt-12">
            <h1 className="text-2xl font-bold text-center col-span-3">
              Invite Members
            </h1>
            <form className="col-start-2 col-end-3 w-full gap-y-4 grid">
              <div className="flex flex-col lg:flex-row gap-4  lg:items-center ">
                <label
                  className="block text-xl font-large text-white-700"
                  htmlFor="team-name"
                >
                  Team :
                </label>
                <input
                  id="team-name"
                  type="text"
                  className="font-mono text-2xl font-bold bg-transparent border-gray-300 focus:outline-none w-full lg:w-2/5"
                  disabled={true}
                  defaultValue={teamName}
                />
              </div>
              <div className="mt-6 flex flex-col lg:flex-row gap-4  lg:items-center ">
                <label
                  className="block text-xl font-large text-white-700"
                  htmlFor="team-name"
                >
                  Select Members
                </label>
              </div>

              <div className="border border-white rounded-xl p-2 m-0 grid grid-cols-[auto,1fr,1fr] gap-6 overflow-y-auto max-h-[50vh]">
                {getAvailableUsers().length ? (
                  getAvailableUsers().map((user) => {
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
                  <div className="col-span-4 text-lg text-red-400 bold-text font-mono text-center">
                    No available users
                  </div>
                )}
              </div>
              <button
                type="submit"
                onClick={(e) => sendInvitations(e)}
                className="bg-white text-[#050816] rounded-xl hover:bg-transparent hover:text-white border hover:border-[$fff] p-2  "
                disabled={loading}
              >
                {loading ? "Sending Invitation..." : "Invite Members"}
              </button>
            </form>
          </section>
          {error && (
            <p className="font-mono text-sm mt-4 text-red-500 text-center">
              {error}
            </p>
          )}
          {message && (
            <div className="text-center">
              <p className="font-mono text-sm mt-4 text-green-500">{message}</p>
              <div className="font-mono text-center">
                <Link
                  to="/teamdetails"
                  className="text-blue-500 hover:text-white text-sm underline"
                >
                  Go to your team
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CreateTeam;
