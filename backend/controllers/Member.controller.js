import Team from "../models/Team.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const removeMember = asyncHandler(async (req, res) => {
    const { memberId, teamId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
        res.status(404).json({ message: "Team doesn't exists" });
    }

    const member = await User.findById(memberId);
    if(!member) {
        res.status(404).json({message:"Member doesn't exists"});
    }

    const index = team.members.findIndex((id) => id == memberId);
    if (index == -1) {
        res.status(404).json({ message: "Team member not found" });
    }

    team.members.splice(index, 1);
    await team.save();

    member.teamId = null;
    await member.save();
    
    res.status(200).json({ message: "Member removed successfully" });
});

export default removeMember;