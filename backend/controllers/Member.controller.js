import asyncHandler from "../utils/asyncHandler.js";
import { sendRemoveEmail,sendTeamJoinEmail } from "../utils/sendMail.js";
import Team from "../models/Team.model.js";
import User from "../models/User.model.js";
import addMemberTransaction from "../db/addMemberTransaction.js";

export const removeMember = asyncHandler(async (req, res) => {
  const { memberId, teamId } = req.params;
  const userId = req.userId;

  // Check if team exists
  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({ message: "Team doesn't exist" });
  }

  // Check if user is leader or admin
  const user = await User.findById(userId);
  const leader = await User.findById(team.leader);

  if (team.leader.toString() !== userId && !user.isAdmin) {
    return res
      .status(401)
      .json({ message: "Only the team leader or an admin can remove members" });
  }

  // Check if member exists
  const member = await User.findById(memberId);
  if (!member) {
    return res.status(404).json({ message: "Member doesn't exist" });
  }

  // Check if member is in team
  const memberIndex = team.members.findIndex(
    (member) => member.toString() === memberId.toString()
  );
  if (memberIndex === -1) {
    return res.status(404).json({ message: "Team member not found" });
  }

  // Optional: Prevent removal of the team leader
  if (team.leader.toString() === memberId) {
    return res.status(403).json({ message: "Cannot remove the team leader." });
  }

  // Remove member from team
  team.members.splice(memberIndex, 1);
  await team.save();

  // Update member's teamId to null
  member.teamId = null;
  await member.save();

  // Send email notification to the member
  await sendRemoveEmail(member, team, leader);
  res.status(200).json({ message: "Member removed successfully" });
});


export const addMember = asyncHandler(async (req, res) => {
    const { teamId, memberId } = req.params;
  
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "User not found" });
    }

    if (member.teamId) {
      return res.status(409).json({ message: "Already a member of a team" });
    }

    const leader = await User.findById(team.leader.toString());
    if (!leader) {
      return res.status(404).json({ message: "Team leader not found" });
    }

    if (team.members.length >= 4) {
      return res.status(403).json({ message: "Can't add more than 4 member in a team" });
    }

    await addMemberTransaction(member, team);
    await sendTeamJoinEmail(leader, member, team);

    return res
      .status(200)
      .json({ message: "Member added to team successfully!!" });
});

