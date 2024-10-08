import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import { createToken } from "../utils/jwt.js";

export const register = asyncHandler(async (req, res,next) => {
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
export const login = asyncHandler(async (req, res,next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(401).json({ message: "Invalid credentials" });
  }
  const token = createToken(user.id, user.email);
  console.log("here")
  res
    .status(200)
    .cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      maxAge: 604800000,
    })
    .json({ message: "logged in successfully" });
    console.log('here too')
});
export const logout = (req,res) => {
  res.clearCookie('jwt');
  res.status(200).json({"message":"logged out succesfully"});

};
