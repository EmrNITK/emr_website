import express from "express";
import { getTeamYears, getTeamByYear, createTeamMember, updateTeamMember, deleteTeamMember } from "../controllers/Team..Member.controller.js";

const router = express.Router();

router.get("/years", getTeamYears);
router.get("/", getTeamByYear);
export default router;
