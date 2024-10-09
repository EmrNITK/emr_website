import Team from '../models/Team.model.js';
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
    const isPresent = await Team.findOne({ name: req.body.name });

    if (isPresent) {
        res.status(409).json({ "message": "Team name already exists." });
    }

    const team = await Team.create({
        name: req.body.name,
        leader: req.userId,
    });

    team.members.push(req.userId);

    await team.save();
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

    res.status(500).json({"message":"Unalbe to rename"});

});

// HANDLE SENDING INVITATIONS

// import Team from '../models/Team.model.js';
import User from '../models/User.model.js';
import { sendEmail } from '../utils/emailService.js'; // A utility function for sending emails
// import asyncHandler from '../utils/asyncHandler.js';

// Function to send invitations
export const sendInvitations = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const { selectedMembers } = req.body; // This should be an array of user emails or IDs

    // Find the team to which invitations are sent
    const team = await Team.findById(teamId);
    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }

    // Send invitations to each selected member
    const promises = selectedMembers.map(async (memberEmail) => {
        const user = await User.findOne({ email: memberEmail });
        if (user) {
            // Send email (You can customize the email content as needed)
            await sendEmail({
                to: memberEmail,
                subject: 'You are invited to join a team',
                text: `You have been invited to join the team: ${team.name}. Click here to accept: <link with teamId>`,
            });
        }
    });

    await Promise.all(promises);

    res.status(200).json({ message: "Invitations sent successfully!" });
});


// Function to handle accepting/rejecting an invitation
export const handleInvite = asyncHandler(async (req, res) => {
    const { teamId, inviteId } = req.params; // Assuming inviteId is some identifier for the action
    const userId = req.userId; // The user accepting the invite (assumed to be set by your auth middleware)

    const team = await Team.findById(teamId);
    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }

    // Add the user to the team members array if they accept
    if (req.body.accepted) { // Assuming the body contains accepted status
        if (!team.members.includes(userId)) {
            team.members.push(userId);
            await team.save();
            return res.status(200).json({ message: "You have joined the team successfully!" });
        } else {
            return res.status(409).json({ message: "You are already a member of this team." });
        }
    }

    // If rejected
    return res.status(200).json({ message: "Invitation rejected." });
});
    