import createTeamTransaction from '../db/createTeamTransaction.js';
import Team from '../models/Team.model.js';
import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import {sendJoinRejectionEmail,sendJoinAcceptanceEmail,sendjoinRequestEmail} from "../utils/sendMail.js"


export const getAllTeams = asyncHandler(async (req, res) => {
    const teams = await Team.find().populate('leader').exec();
    res.status(200).json({ teams });
})

export const getTeamById = asyncHandler(async (req, res) => {
    const teamId = req.params.teamId;
    const team = await Team.findById(teamId);
    if (!team) {
        res.status(404).json({ "message": "Team Not Found" });
    }
    res.status(200).json({ team });
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

export const JoinTeamRequest = asyncHandler(async (req, res) => {
    const teamId = req.params.teamId;

    const userId = req.userId;

    const user = await User.findById(userId);

    const team = await Team.findById(teamId);

    const leaderId = team.leader.toString();
    const userr = await User.findById(leaderId);
    if (team.members.indexOf(userId) != -1) {
        return res.status(403).json({ message: "User is already a member of this team" });
    }
    await sendjoinRequestEmail(user, userr);

    res.status(200).json({ message: "join request sent" });
});
export const acceptTeamRequest = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const teamId = req.params.teamId;

    const userExists = await User.findById(userId);
    if (!userExists) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        { $addToSet: { members: userId } },
        { new: true, runValidators: true }
    );

    if (!updatedTeam) {
        return res.status(404).json({ success: false, message: "Team not found" });
    }
    const leaderId = updatedTeam.leader.toString();
    const leader = await User.findById(leaderId);

    if (updatedTeam.members.length > 4) {
        return res
            .status(400)
            .json({ success: false, message: "Cannot exceed 4 members" });
    }
    if (updatedTeam.members.indexOf(userId) != -1) {
        return res.status(403).json({ message: "User is already a member of this team" });
    }
    await sendJoinAcceptanceEmail(userExists, updatedTeam, leader);
    res.status(200).json({ success: true, data: updatedTeam });

    console.log("updateTeam", updateTeam);
    // res.status(200).json({ message: "memeberis added" });
});
export const rejectTeamRequest = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const teamId = req.params.teamId;

    const userExists = await User.findById(userId);
    if (!userExists) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedTeam = await Team.findByIdAndUpdate(teamId);

    if (!updatedTeam) {
        return res.status(404).json({ success: false, message: "Team not found" });
    }
    const leaderId = updatedTeam.leader.toString();
    const leader = await User.findById(leaderId);
    if (updatedTeam.members.indexOf(userId) != -1) {
        return res.status(403).json({ message: "User is already a member of this team" });
    }
    await sendJoinRejectionEmail(userExists, updatedTeam, leader);
    res.status(200).json({ success: true, msg: "rejected request" });

    console.log("updateTeam", updateTeam);
});