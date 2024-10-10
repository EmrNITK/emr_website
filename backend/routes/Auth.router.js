import express from "express";
import { register, logout, login,sendOTP,verifyOTP, createNewPassword, changePassword } from "../controllers/Auth.controller.js";
import {
  validateRegistration,
  validateLogin,
 
} from "../middlewares/validate.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegistration, register);

authRouter.post("/login", validateLogin, login);

authRouter.post("/logout", logout);

authRouter.post("/forgot_password/get_otp",sendOTP);
authRouter.post("/forgot_password/verify",verifyOTP);
authRouter.post("/forgot_password/new",createNewPassword);

authRouter.post("/change_password",verifyJwt,changePassword);

export default authRouter;
