import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import { sendVerificationEmail, sendAcceptanceEmail, sendRejectionEmail } from "../utils/sendMail.js";
import dotenv from "dotenv";

dotenv.config();

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
  if (req.query._method === 'PUT') {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(403).json({ message: "User already verified" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );
    await sendAcceptanceEmail(updatedUser);

    return res.status(200).json({ message: "User verification done.." });
  }
  else {
    res.status(404).json({ message: 'Bad request' });
  }
});

export const rejectVerification = asyncHandler(async (req, res) => {
  if (req.query._method === 'POST') {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await sendRejectionEmail(user);

    res.status(403).json({ message: `User has been rejected.` });
  }
  else {
    res.status(404).json({ message: 'Bad Request' });
  }
});

export const getVerifiedUser = asyncHandler(async (req, res) => {
  const user = await User.find({});

  const verifiedUsers = user.filter(users => users.isVerified === true);

  res.status(200).json(verifiedUsers);
});

export const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).populate('teamId');
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  res.status(200).json(user);
});



