import express from "express";
import {
  sendMailToAdmin,
  rejectVerification,
  acceptVerification,
  getVerifiedUser,
  getUserById,
  getAllUsers,
} from "../controllers/User.controller.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const userRouter = express.Router();

userRouter.post("/verify", verifyJwt, sendMailToAdmin);
userRouter.get('/verify/:userId/accept', acceptVerification);
userRouter.get("/verify/:userId/reject", rejectVerification);

userRouter.get("/", verifyJwt, getVerifiedUser);
userRouter.get("/all", verifyJwt, getAllUsers);
userRouter.get("/:userId", verifyJwt, getUserById);

export default userRouter;
