import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Null if entirely new
  name: { type: String, required: true },
  role: { type: String}, // Position
  image: { type: String, default: '' },
  year: { type: Number, default: new Date().getFullYear() },
  rank: { type: Number, default: 99 },
  bio: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  instagram: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);