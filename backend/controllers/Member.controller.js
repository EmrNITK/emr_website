import asyncHandler from "../utils/asyncHandler.js";
import { sendRemoveEmail } from "../utils/sendMail.js";
import Team from '../models/Team.model.js';
import User from '../models/User.model.js';

const removeMember = asyncHandler(async (req, res) => {
    const { memberId, teamId } = req.params;
    const userId = req.userId;

    // Check if team exists
    const team = await Team.findById(teamId);
    if (!team) {
        return res.status(404).json({ message: "Team doesn't exists" });
    }
    const user = await User.findById(userId);

    const leader = await User.findById(team.leader);
    // Check if user is leader
    if (team.leader.toString() != userId||user.isAdmin) {
        return res.status(401).json({ message: "Only leader can remove members" });
    }

    // Check if member exists
    const member = await User.findById(memberId);
    if (!member) {
        return res.status(404).json({ message: "Member doesn't exists" });
    }

    // Check if member is in team
    const index = team.members.findIndex(member => member.toString() === memberId.toString());
    if (index == -1) {
        return res.status(404).json({ message: "Team member not found" });
    }

    // Remove member from team
    team.members.splice(index, 1);
    await team.save();

    // Update member
    member.teamId = null;
    await member.save();

    // Send mail to member
    await sendRemoveEmail(member, team, leader);
    res.status(200).json({ message: "Member removed successfully" });
});

export default removeMember;