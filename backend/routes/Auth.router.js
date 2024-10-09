import express from "express";
import { register, logout, login, changePassword } from "../controllers/Auth.controller.js";
import {
  validateRegistration,
  validateLogin,
 
} from "../middlewares/validate.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegistration, register);

authRouter.post("/login", validateLogin, login);

authRouter.post("/logout", logout);

authRouter.post("/change_password",verifyJwt,changePassword);

export default authRouter;
