import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import { createToken, createOTPToken } from "../utils/jwt.js";
import { sendOTPService } from "../utils/sendOTPService.js";

export const register = asyncHandler(async (req, res) => {
  const isPresent = await User.findOne({ email: req.body.email });

  if (isPresent) {
    res.status(409).json({ message: "User already exists" });
  }


  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({
    name: req.body.name,
    // branch: req.body.branch,
    year:req.body.year,
    collegeName: req.body.collegeName,
    mobileNo: req.body.mobileNo,
    rollNo: req.body.rollNo,
    email: req.body.email.toLowerCase(),
    password: hashedPassword,
    kaggleUserName: req.body.kaggleUserName,
  });

  const registerUser = await user.save();
  res.status(200).json(registerUser);
});


export const login = asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(401).json({ message: "Invalid credentials" });
  }

  const token = createToken(user._id, user.email);
  res
    .json({ user: user, token });
});


export const logout = (req, res) => {
  res.status(200).json({ message: "logged out succesfully" });
};


export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const ismatch = await bcrypt.compare(currentPassword, user.password);
  if (!ismatch) {
    return res.status(403).json({ message: "currentPassword is incorrect" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();
  return res.status(200).json({ message: "password is changed" });
});

export const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userEmail = email.toLowerCase();
  // Check if user with given email exists
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return res.status(404).json({ message: "User with given email not found" });
  }

  // Send OTP to given email
  await sendOTPService(userEmail);
  res.status(200).json({ message: "OTP sent" });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const userEmail = email.toLowerCase();
  // Check if user exists
  const user = await User.findOne({
    email: userEmail
  });

  if (!user) {
    return res.status(404).json({ message: "User with given email not found" });
  }

  // Check if OTP is expired
  const currentTime = new Date();
  if (currentTime > user.otpExpireAt) {
    // Invalidate OTP
    user.otp = null;
    user.otpExpireAt = null;
    await user.save();
    return res.status(401).json({ message: "OTP has expired" });
  }

  console.log(user);
  // Check if OTP matches
  if (otp !== user.otp) {
    return res.status(401).json({ message: "OTP didn't match" });
  }

  // Removes OTP and save user
  user.otp = null;
  user.otpExpireAt = null;
  await user.save();

  // Create a token and send it in cookies
  const token = createOTPToken(user.email);
  console.log("Generated token:", token);

  res
    .json({ user, token });
});

export const createNewPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  const userEmail = email.toLowerCase();
  const decodedEmail = req.otpVerificationEmail;

  // Check if user exists
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return res.status(404).json({ message: "User with given email not found" });
  }

  // Check if token is valid
  if (!(decodedEmail == userEmail)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Create hash
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: "Password Changed Successfuly" });
});
