import express from "express";
import { register, logout, login } from "../controllers/Auth.controller.js";
import {
  validateRegistration,
  validateLogin,
} from "../middlewares/validate.middlewares.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegistration, register);

authRouter.post("/login", validateLogin, login);

authRouter.post("/logout", logout);

authRouter.post("/forgot_password/get_otp",sendOTP);
authRouter.post("/forgot_password/verify",verifyOTP);

export default authRouter;
