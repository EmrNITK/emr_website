import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import { sendVerificationEmail, sendAcceptanceEmail, sendRejectionEmail } from "../utils/sendMail.js";

export const sendMailToAdmin = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { transactionId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await sendVerificationEmail(user, transactionId);

  res.status(200).json({ message: "Verification email sent successfully" });
});

export const acceptVerification = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isVerified) {
    return res.status(403).json({ message: "User already verified" });
  }

  await User.findByIdAndUpdate(userId, { isVerified: true });
  await sendAcceptanceEmail(user);

  res.json({ message: `User verified successfully` });
});

export const rejectVerification = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await sendRejectionEmail(user);

  res.status(403).json({ message: `User has been rejected.` });
});

export const getVerifiedUser = asyncHandler(async (req, res) => {
  const user = await User.find({});
  
  const verifiedUsers = user.filter(users => users.isVerified === true);

  res.status(200).json(verifiedUsers);
});

export const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }
  
  res.status(200).json(user);
});



