import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.SECRET, {
    expiresIn: "7d",
  });
};

export const createOTPToken = (email) => {
  return jwt.sign({ email }, process.env.SECRET, {
    expiresIn: "7d",
  });
  
};
