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

export default authRouter;
