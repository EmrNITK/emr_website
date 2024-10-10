import asyncHandler from "../utils/asyncHandler.js";
import User from '../models/User.model.js';
import Team from '../models/Team.model.js';
import { sendJoinRejectionEmail, sendJoinAcceptanceEmail, sendjoinRequestEmail } from "../utils/sendMail.js"

export const joinRequest = asyncHandler(async (req, res) => {
    console.log(req);
    const teamId = req.params.teamId;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const team = await Team.findById(teamId);
    console.log(teamId,team);
    // Check if team exists
    if (!team) {
        res.status(404).json({ message: "Team not found" });
    }

    // If user is already member of team
    if (team.members.indexOf(userId) != -1) {
        return res.status(403).json({ message: "User is already a member of this team" });
    }

    // Check if team has vacancy
    if (team.members.length == 4) {
        return res.status(403).json({ message: "Team is full" });
    }


    const leaderId = team.leader.toString();
    const leader = await User.findById(leaderId);


    await sendjoinRequestEmail(user, leader);

    res.status(200).json({ message: "Join request sent successfully" });
});


export const rejectJoinRequest = asyncHandler(async (req, res) => {
    const memberId = req.params.memberId;
    const teamId = req.params.teamId;

    const member = await User.findById(memberId);
    if (!member) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
        return res.status(404).json({ success: false, message: "Team not found" });
    }

    const leaderId = team.leader.toString();
    const leader = await User.findById(leaderId);

    if (team.members.indexOf(memberId) != -1) {
        return res.status(403).json({ message: "User is already a member of this team" });
    }

    await sendJoinRejectionEmail(member, team, leader);

    res.status(200).json({ message: "Reject join request" });
});


export const acceptJoinRequest = asyncHandler(async (req, res) => {
    const memberId = req.params.memberId;
    const teamId = req.params.teamId;

    const member = await User.findById(memberId);
    if (!member) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
        return res.status(404).json({ success: false, message: "Team not found" });
    }


    if (team.members.length == 4) {
        return res
            .status(400)
            .json({ message: "Team is full" });
    }

    if (team.members.indexOf(memberId) != -1) {
        return res.status(403).json({ message: "User is already a member of this team" });
    }

    team.members.push(memberId);
    await team.save();

    member.teamId = team._id;
    await member.save();

    const leaderId = team.leader.toString();
    const leader = await User.findById(leaderId);

    await sendJoinAcceptanceEmail(member, team, leader);

    res.status(200).json({ message: "Member added successfully" });

});
