import express from "express";
import {
  sendMailToAdmin,
  rejectVerification,
  acceptVerification,
  getVerifiedUser,
  getUserById,
} from "../controllers/User.controller.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const userRouter = express.Router();

userRouter.post("/verify", verifyJwt, sendMailToAdmin);
userRouter.put("/verify/:userId/accept", acceptVerification);
userRouter.post("/verify/:userId/reject", rejectVerification);

userRouter.get("/", verifyJwt, getVerifiedUser);
userRouter.get("/:userId", verifyJwt, getUserById);

export default userRouter;
