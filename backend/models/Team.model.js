import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: [arrayLimit, '{PATH} exceeds the limit of 4']
  }],
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 4;
}

export const Team = mongoose.model('Team', teamSchema);
