import Team from "../models/Team.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const removeMember = asyncHandler(async(req,res)=>{
    const {memberId,teamId} = req.params;

    const team = await Team.findById(teamId);
    const index = team.members.findIndex((id)=>id == memberId);

    console.log(index);
});