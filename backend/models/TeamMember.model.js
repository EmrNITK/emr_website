import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String },
    desc: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    year: { type: Number, required: true }, // e.g. 2025
    order: { type: Number, default: 0 }, // for sorting
  },
  { timestamps: true }
);

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

export default TeamMember;