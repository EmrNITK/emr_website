import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: false,
    },
    collegeName: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: false,
    },
    rollNo: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
      ref: "Team",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpireAt: {
      type: Date,
    },
    kaggleUserName:{
      type: String,
      required:true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
