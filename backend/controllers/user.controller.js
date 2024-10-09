import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import { sendVerificationEmail,sendAcceptanceEmail,sendRejectionEmail } from "../utils/sendMail.js";

export const sendMailToAdmin = asyncHandler(async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  const { transaction_id } = req.body;
  console.log(transaction_id, userId);
  const user = await User.findOne({ id: userId });
  console.log(user);
  //   const adminEmail = process.env.ADMIN_EMAIL ;
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await sendVerificationEmail(user, transaction_id);

  res.status(200).json({ message: "Verification email sent successfully" });
});

export const acceptedInviteByAdmin = asyncHandler(async (req, res) => {
  const userId = req.userId;
  console.log(userId);

  const user = await User.findOne({ id: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await User.findByIdAndUpdate(userId, { isVerified: true });
  await sendAcceptanceEmail(user);

  console.log("verified mail has been sent ")
  res.json({ message: `User ${userId} has been verified.` });
});

export const rejectedInviteByAdmin = asyncHandler(async (req, res) => {
  const userId = req.userId;
  console.log(userId);

  const user = await User.findOne({ id: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
 
  await sendRejectionEmail(user);

  console.log("verified mail has been sent ")

  res.status(403).json({ message: `User ${userId} has been rejected.` });
});
