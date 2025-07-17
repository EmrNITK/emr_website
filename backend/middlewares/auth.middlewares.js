import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();
import User from "../models/User.model.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "unauthorised" });
  }

  const decodedtoken = jwt.verify(token, process.env.SECRET);

  req.userId = decodedtoken.id;

  next();
});

export const verifyTempOtpJwt = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "unauthorised" });
  }

  const decodedtoken = jwt.verify(token, process.env.SECRET);

  req.otpVerificationEmail = decodedtoken.email;

  next();
});

// Middleware to check if the user is admin
export const isUserAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
});
