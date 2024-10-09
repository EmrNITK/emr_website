import express from "express";
import {
  sendMailToAdmin,
  rejectedInviteByAdmin,
 acceptedInviteByAdmin,
 getVerifiedUser,
 getUserById
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const userRouter = express.Router();

userRouter.post("/verify", verifyJwt, sendMailToAdmin);

userRouter.put("/verify/accept", verifyJwt, acceptedInviteByAdmin);

userRouter.post("/verify/reject", verifyJwt, rejectedInviteByAdmin);

userRouter.get("/", verifyJwt, getVerifiedUser);

userRouter.get("/:userId", verifyJwt, getUserById);

export default userRouter;
