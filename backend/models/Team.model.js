import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
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
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 4;
}

const Team = mongoose.model('Team', teamSchema);

export default Team;
