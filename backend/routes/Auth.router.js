import express from "express";
import { register, logout, login,sendOtp,verifyOTP, createNewPassword } from "../controllers/Auth.controller.js";
import {
  validateRegistration,
  validateLogin,
} from "../middlewares/validate.middlewares.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegistration, register);

authRouter.post("/login", validateLogin, login);

authRouter.post("/logout", logout);

authRouter.post("/forgot_password/get_otp",sendOtp);
authRouter.post("/forgot_password/verify",verifyOTP);
authRouter.post("/forgot_password/new",createNewPassword);



export default authRouter;
