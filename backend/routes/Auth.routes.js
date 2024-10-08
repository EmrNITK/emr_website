import express from "express";
import { register, logout, login } from "../controllers/authController.js";
import { validateRegistration } from "../middlewares/validate.js";
const authRouter = express.Router();

authRouter.post("/register", validateRegistration, register);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

export default authRouter;
