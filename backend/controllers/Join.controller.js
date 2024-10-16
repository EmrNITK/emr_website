import asyncHandler from "../utils/asyncHandler.js";
import User from '../models/User.model.js';
import Team from '../models/Team.model.js';
import {
    sendJoinRejectionEmail,
    sendJoinAcceptanceEmail,
    sendJoinRequestEmail,
} from "../utils/sendMail.js";

export const joinRequest = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.teamId) {
        return res.status(403).json({ message: "User already a member of team" });
    }

    const team = await Team.findById(teamId);
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

    await sendJoinRequestEmail(user, team, leader);

    return res.status(200).json({ message: "Join request sent successfully" });
});

export const rejectJoinRequest = asyncHandler(async (req, res) => {
    if (req.query._method === 'POST') {
        const { memberId, teamId } = req.params;

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
    } else {
        res.status(404).json({ message: 'Bad request' });
    }
});

export const acceptJoinRequest = asyncHandler(async (req, res) => {
    if (req.query._method === 'PUT') {
        const { memberId, teamId } = req.params;

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

        return res.json({ message: "Member added successfully" });
    } else {
        res.status(404).json({ message: 'Bad request' });
    }

});
