import mongoose from "mongoose";
import User from "../models/User.model.js";
import Team from "../models/Team.model.js";

const addMemberTransaction = async (user, team) => {

    let updatedTeam = new Team({
        ...team,
        _id: team._id,
        members: [...team.members, user._id]
    });

    let updatedUser = new User({
        ...user,
        _id: user._id,
        isVerified: user.isVerified,
        teamId: team._id,
    });

    const session = await mongoose.startSession();

    try {
        await User.findByIdAndUpdate({ _id: updatedUser._id }, updatedUser, { session });
        await Team.findByIdAndUpdate({ _id: updatedTeam._id }, updatedTeam, { session });

        await session.commitTransaction();
    } catch (err) {
        session.aboortTranssaction();
        throw err;
    } finally {
        session.endSession();
        return updatedUser;
    }
};

export default addMemberTransaction;



