import express from "express";
import { getTeamYears, getTeamByYear, createTeamMember, updateTeamMember, deleteTeamMember } from "../controllers/Team..Member.controller.js";

const router = express.Router();

// Public endpoints
router.get("/years", getTeamYears);
router.get("/", getTeamByYear);

// Admin endpoints
router.post("/create-team-member", createTeamMember);
router.put("/team/:id", updateTeamMember);
router.delete("/team/:id", deleteTeamMember);

export default router;
