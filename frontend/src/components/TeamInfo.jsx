import { useRef, useState } from "react";
import { removeMember, addMemberToTeam, getUserById } from "../api/apiService";

const TeamInfo = ({
  team,
  users,
  setTeams,
  setAvailableUsers,
  handleDeleteTeam,
}) => {
  const dialogRef = useRef(null);
  const [showUsers, setShowUsers] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const openDialog = () => {
    dialogRef.current?.showModal();
  };
  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const availableUsers = () =>
    users.filter(
      (user) =>
        !user.teamId &&
        !user.isAdmin &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleDeleteMember = async (teamId, memberId, isLeader) => {
    if (isLeader) {
      setError("You cannot remove the team leader.");
      setMessage("");
      return;
    }

    setMessage("Removing Member...");
    setError("");
    try {
      const response = await removeMember(teamId, memberId);
      const member = await getUserById(memberId);

      // Update Team state
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team._id === teamId
            ? {
                ...team,
                members: team.members.filter(
                  (member) => member._id !== memberId
                ),
              }
            : team
        )
      );

      // Update available users
      setAvailableUsers((prevUsers) => [...prevUsers, member]);

      setMessage(response.message);
      setError("");
    } catch (error) {
      setError(error.message || "Error deleting member.");
      setMessage("");
    }
  };

  const handleAddMember = async (teamId, memberId) => {
    setMessage("Adding Member...");
    try {
      const response = await addMemberToTeam(teamId, memberId);
      const member = await getUserById(memberId);

      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team._id === teamId
            ? {
                ...team,
                members: [...team.members, member],
              }
            : team
        )
      );

      // Update available users
      setAvailableUsers((prevUsers) =>
        prevUsers.filter((user) => !(user._id === memberId))
      );
      setMessage(response.message);
      setError("");
    } catch (error) {
      setError(error.message || "Error adding member.");
      setMessage("");
    }
  };

  return (
    <>
      <div className="w-4/5 md:w-3/5 flex flex-col gap-4 bg-white/5  backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm p-3 rounded-lg shadow-lg">
        {/* Basic Team Details */}
        <div>
          <div className="text-2xl">{team.name}</div>
          <div>Leader: {team.leader?.name}</div>
          <div>Members: {team.members?.length}/4</div>
        </div>
        {/* Team Details Dialog */}
        <dialog
          className="w-4/5 md:w-3/5 realative m-auto bg-[#040714]/90 backdrop-opacity-10 backdrop-brightness-20 shadow-lg backdrop-blur-sm p-3 rounded-lg open:flex flex-col backdrop:bg-white/20 backdrop:backdrop-blur-sm "
          id="dialog"
          ref={dialogRef}
        >
          <h1 className="text-2xl">Team</h1>
          {message && <p className="text-green-500 font-mono">{message}</p>}
          {error && <p className="text-red-500 font-mono">{error}</p>}
          {/* Team Members */}
          <div className="mb-4">
            <h2>Members:</h2>

            {team.members?.map((member) => (
              <div
                key={member._id}
                className="flex flex-row justify-between md:grid md:grid-cols-3 md:justify-items-center p-2 bg-white/10 backdrop-opacity-10 backdrop-brightness-20 rounded-lg backdrop-blur-sm mt-4"
              >
                <div className="basis-1/3 justify-self-start">
                  {member.name}
                </div>
                <div className="basis-1/3">{member.rollNo}</div>
                <button
                  className="basis-1/3 bg-red-500 rounded-md text-xs md:text-s w-fit font-semibold px-1 md:px-2 py-1 md:py-1 self-end align-end"
                  onClick={() => {
                    handleDeleteMember(team._id, member._id, member.isLeader);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Available users */}
          {team.members?.length < 4 && showUsers ? (
            <div className="">
              <h2>Available Users:</h2>
              <div className="mx-6 my-2">
                <input
                  id="search"
                  type="text"
                  placeholder="Search by Name"
                  className="bg-transparent border px-4 py-2 rounded-md border-gray-300 focus:outline-none w-full"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="overflow-y-auto max-h-[50vh]">
                {availableUsers().map((user) => {
                  return (
                    <div className="text-s md:text-base mx-6 my-2 grid gap-2 grid-cols-1 md:grid-cols-3 md:justify-items-center p-2 bg-white/10 backdrop-opacity-10 backdrop-brightness-20 rounded-lg backdrop-blur-sm mt-4 content-center">
                      <div className="basis-1/3 justify-self-start self-center text-nowrap">
                        {user.name}
                      </div>
                      <div className="text-xs md:text-base self-center">
                        {user.email}
                      </div>
                      <button
                        className="bg-green-500 rounded-md text-xs md:text-s w-fit font-semibold px-2 md:px-4 py-2 justify-self-end"
                        onClick={() => {
                          handleAddMember(team._id, user._id);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <></>
          )}

          {/* Dialog Controls */}
          <div className="mt-4 self-end">
            {team.members.length < 4 && (
              <button
                onClick={() => setShowUsers(!showUsers)}
                className={`${
                  showUsers ? "bg-red-600" : "bg-green-600"
                }  rounded-md text-s md:text-base font-semibold mx-1 md:mx-2 px-3 md:px-4 py-1 md:py-2`}
              >
                {showUsers ? "Close Users" : "Add Members"}
              </button>
            )}
            <button
              onClick={closeDialog}
              className=" mt-2 bg-red-600 rounded-md text-s md:text-base font-semibold mx-1 md:mx-2 px-3 md:px-4 py-1 md:py-2"
            >
              Close
            </button>
          </div>
        </dialog>

        {/* Team Controls */}
        <div className="self-end ">
          <button
            className="bg-green-500 rounded-md text-xs md:text-base font-semibold mx-1 md:mx-2 px-3 md:px-4 py-1 md:py-2"
            onClick={openDialog}
          >
            Details
          </button>
          <button
            onClick={() => handleDeleteTeam(team._id)}
            className="bg-red-500 hover:bg-red-600 rounded-md text-xs md:text-base font-semibold mx-1 md:mx-2 px-3 md:px-4 py-1 md:py-2"
          >
            Delete Team
          </button>
        </div>
      </div>
    </>
  );
};

export default TeamInfo;
