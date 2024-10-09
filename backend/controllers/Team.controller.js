import createTeamTransaction from '../db/createTeamTransaction.js';
import Team from '../models/Team.model.js';
import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';

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
    const team = await createTeamTransaction(name,user);

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

