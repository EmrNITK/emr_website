import createTeamTransaction from '../db/createTeamTransaction.js';
import Team from '../models/Team.model.js';
import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';


export const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find().populate("leader").populate("members").exec();
  res.status(200).json({ teams });
})

export const getTeamById = asyncHandler(async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId).populate('members').populate('leader');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ team });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team details', error });
  }
});

export const createTeam = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const name = req.body.name;
  const isPresent = await Team.findOne({ name: req.body.name });
  const user = await User.findOne({ _id: userId });

  // Check if user is already a member of a team.
  if (user.teamId) {
    res.status(409).json({ "message": "Already a member of a team" });
  }

  // Check if team name alrady exists.
  if (isPresent) {
    res.status(409).json({ "message": "Team name already exists." });
  }

  // Use transaction to Create Team and Update User
  const team = await createTeamTransaction(name, user);

  res.status(200).json({ team });
});

export const updateTeam = asyncHandler(async (req, res) => {
  const name = req.body.name;

  const isPresent = await Team.findOne({ name: req.body.name });

  if (isPresent) {
    res.status(409).json({ "message": "Team name already exists." });
  }

  const team = await Team.updateOne({ _id: req.params.teamId }, { name });

  if (team.modifiedCount > 0) {
    res.status(200).json(team);
  };

  res.status(500).json({ "message": "Unalbe to rename" });

});

export const deleteTeam = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const teamId = req.params.teamId;

  const team = await Team.findById(teamId).populate('members');

  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  if (!((user.teamId == teamId && user.isLeader) || user.isAdmin)) {
    return res.status(403).json({ message: "Only Leader can delete team" });
  }

  await Promise.all(
    team.members.map(async (member) => {
      const user = await User.findById(member._id);
      console.log(user)
      if (user) {
        user.teamId = null;
        user.isLeader = false;
        await user.save();
      }
    })
  );

  await Team.deleteOne({_id:teamId});

  res.status(200).json({ message: "Team and its members were successfully deleted" });
});

export const leaveTeam = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const teamId = req.params.teamId;

  // Find the team and populate members
  const team = await Team.findById(teamId).populate("members");

  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  // Check if the user is a part of the team
  const user = await User.findById(userId);
  if (!user || !team.members.some((member) => member._id.equals(userId))) {
    return res
      .status(403)
      .json({ message: "You are not a member of this team" });
  }

  // Check if the user is the leader
  if (team.leader.equals(userId)) {
    // If the leader is leaving, delete the team
    await Promise.all(
      team.members.map(async (member) => {
        const memberUser = await User.findById(member._id);
        if (memberUser) {
          memberUser.teamId = null;
          memberUser.isLeader = false;
          await memberUser.save();
        }
      })
    );

    // Delete the team
    await Team.deleteOne({ _id: teamId });
    return res.status(200).json({ message: "Team deleted as the leader left" });
  }

  // If a non-leader member is leaving
  team.members = team.members.filter((member) => !member._id.equals(userId));
  await team.save();

  user.teamId = null;
  user.isLeader = false;
  await user.save();

  res.status(200).json({ message: "Successfully left the team" });
});

