import User from "../models/User.model.js";
import Team from "../models/Team.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  sendInvitationEmail,
  inviteAcceptedEmail,
  inviteRejectedEmail,
} from "../utils/sendMail.js";
import addMemberTransaction from "../db/addMemberTransaction.js";

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

    if (user) {
      // Send email (You can customize the email content as needed)
      await sendInvitationEmail(user, team);
    }
  });

  await Promise.all(promises);

  res.status(200).json({ message: "Invitations sent successfully!" });
});

// for handling accept response from the invite email
export const acceptInvitation = asyncHandler(async (req, res) => {
  if (req.query._method === 'PUT') {
    const { teamId, userId } = req.params;
    // inviteId is the userId of the invited user;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.teamId) {
      return res.status(409).json({ message: "Already a member of a team" });
    }

    const leader = await User.findById(team.leader.toString());
    if (!leader) {
      return res.status(404).json({ message: "Team leadre not found" });
    }

    await addMemberTransaction(user, team);
    await inviteAcceptedEmail(leader,user, team);

    return res
      .status(200)
      .json({ message: "You have joined the team successfully!" });
  } else {
    res.status(404).json({ message: 'Bad request' });
  }
});

export const rejectInvitation = asyncHandler(async (req, res) => {
  if (req.query._method === 'POST'
  ) {
    const { teamId, userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    if (team.members.indexOf(userId) != -1) {
      return res.status(403).json({ message: "User is already a member of this team" });
    }

    const leader = await User.findById(team.leader.toString());
    if (!leader) {
      return res.status(404).json({ message: "Team leadre not found" });
    }

    await inviteRejectedEmail(leader,user, team);

    res.status(403).json({ message: `You have rejected the invitation.` });
  } else {
    res.status(404).json({ message: 'Bad request' });
  }
});
