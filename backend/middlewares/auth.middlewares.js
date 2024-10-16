import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();

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
