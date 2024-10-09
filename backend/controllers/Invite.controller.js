import User from '../models/User.model.js';
import { sendEmail } from '../utils/emailService.js'; // A utility function for sending emails
import Team from '../models/Team.model.js';
import asyncHandler from '../utils/asyncHandler.js';

// HANDLE SENDING INVITATIONS
// Function to send invitations
export const sendInvitations = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const { members } = req.body; // array of ids of users to be invited to join team

    const team = await Team.findById(teamId);
    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }
    // Send invitations to each selected member
    const promises = members.map(async (userId) => {
        const user = await User.findById(userId);
        const link = `http://localhost:3000/api/invite/${userId}/invites/${userId}`;
        const memberEmail = user.email;
        if (user) {
            // Send email (You can customize the email content as needed)
            await sendEmail({
                to: memberEmail,
                subject: 'You are invited to join a team',
                text: `You have been invited to join the team: ${team.name}. Click here to accept: ${link}`,
            });
        }
    });

    await Promise.all(promises);

    res.status(200).json({ message: "Invitations sent successfully!" });
});


// for handling accept response from the invite email

export const handleInvite = asyncHandler(async (req, res)=>{
    const {teamId, inviteId} = req.params;
    // inviteId is the userId of the invited user;
    const team = await Team.findById(teamId);
    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }

    const user = await User.findById(inviteId);
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    
    if (!team.members.includes(inviteId)) {
        
        // pushing userId into the members array of that team;
        team.members.push(inviteId);
        await team.save(); // Save changes to the team
        
        // updating teamId of the user
        user.teamId = teamId;
        await user.save();
        return res.status(200).json({ message: "You have joined the team successfully!" });
    }
    return res.status(409).json({ message: "You are already a member of this team." });
})