import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
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
    otp:{
      type:String,
    },
    otpExpireAt:{
      type: Date,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
