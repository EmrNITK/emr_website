import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
  },
  roll: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  op: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isLeader: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
