import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyJwt = asyncHandler(async (req, res, next) => {

  const token = req.cookies.jwt;

  if (!token) {
    res.status(401).json({ message: "unauthorised" });
  }

  const decodedtoken = jwt.verify(token, process.env.SECRET);
  
  req.userId = decodedtoken.id;

  next();
});
