import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  role: { type: String, enum: ['Student', 'Alumni', 'Other'] },
  collegeName: { type: String },
  rollNo: { type: String },
  collegeEmail: { type: String },
  collegeEmailVerified: { type: Boolean, default: false },
  collegeOtp: { type: String },
  graduationYear: { type: String },
  currentCompany: { type: String },
  profession: { type: String },
  organization: { type: String },
  bio: { type: String },
  profilePhoto: { type: String, default: '' },
  userType: {type: String, default: ''},
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  instagram: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);