import express from "express";
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProject
} from "../controllers/Project.controller.js";
import { verifyJwt, isUserAdmin } from "../middlewares/auth.middlewares.js";

const projectRouter = express.Router();

projectRouter.post("/", verifyJwt, isUserAdmin, createProject);

projectRouter.get("/", getAllProjects);

projectRouter.get("/:projectId", getProjectById);

projectRouter.put("/:projectId", verifyJwt, isUserAdmin, updateProjectById);

projectRouter.delete("/:projectId", verifyJwt, isUserAdmin, deleteProject);


export default projectRouter;