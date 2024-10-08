import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import dotenv from "dotenv";
dotenv.config();
export const verifyJwt = asyncHandler(async (req, res) => {
  const token = req.cookies.jwt;
  console.log(token);
  if (!token) {
    res.status(401).json({ message: "unauthorised" });
  }
  const decodedtoken = jwt.verify(token, process.env.SECRET);
  req.userId = decodedtoken.id;
  next();
});
