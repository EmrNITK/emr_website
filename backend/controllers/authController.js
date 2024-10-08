import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";

export const register = asyncHandler(async (req, res) => {
  const isPresent = await User.findOne({ email: req.body.email });

  if (isPresent) {
    res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({
    name: req.body.name,
    branch: req.body.branch,
    collegeName: req.body.collegeName,
    mobileNo: req.body.mobileNo,
    rollNo: req.body.rollno,
    email: req.body.email,
    password: hashedPassword,
  });

  const registerUser = await user.save();
  res.status(200).json(registerUser);
});
export const login = () => {};
export const logout = () => {};
