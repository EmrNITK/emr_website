import express from "express";
// import { getTeamYears, getTeamByYear, createTeamMember, updateTeamMember, deleteTeamMember } from "../controllers/Team..Member.controller.js";
import teamRouter from "./Team.member.router.js";

const router = express.Router();

// Public endpoints
router.use("/team", teamRouter);

export default router;