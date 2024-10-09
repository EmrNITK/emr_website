import mongoose from "mongoose";
import User from "../models/User.model.js";
import Team from "../models/Team.model.js";

const createTeamTransaction = async (teamName, user) => {

    let team = new Team({ name: teamName, leader: user._id, members: [user._id] });

    let updateUser = new User({
        ...user,
        _id: user._id,
        isLeader: true,
        teamId: team._id,
    });

    const session = await mongoose.startSession();

    try {
        await team.save({ session });
        await User.findByIdAndUpdate({ _id: updateUser._id }, updateUser, { session });

        await session.commitTransaction();
    } catch (err) {
        session.aboortTranssaction();
        throw err;
    } finally {
        session.endSession();
        return team;
    }
};

export default createTeamTransaction;



