import mongoose from 'mongoose';
import User from './User.model.js';
import Team from './Team.model.js';

const EventSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true,
        unique: true,
    },
    date : {
        type: Date,
        required : true,
    },
    venue : {
        type: String,
        required: true,
    },
    numberOfMember: {
        type: Number,
        required: true,
    },
    poster: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ruleBook: {
        type: String,
    },
    amount:{
        type: Number,   // Amount
    },
    qrCode:{
        type: String,  // QR-Image
    },
    coordinator: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: User,
        }
    ],
    title:{
        type: String,  // title
    },
    link:{
        type: String,  // link
    },
    leaderboard: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: User,   
        }
    ],
    teams: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: Team, 
        }
    ],
    participants: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: User,
        }
    ],
    islive: {
        type: Boolean,
        required : true,
        default: false,
    }
},
{
    timestamps : true
}
)

const Event = mongoose.model('Event', EventSchema);

export default Event;