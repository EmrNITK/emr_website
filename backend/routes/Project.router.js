import express from "express";
import {
    createProject,
    getAllProjects,
    getProjectByName,
    updateProject,
    updateProjectPhoto,
    deleteProject
} from "../controllers/Project.controller.js";
import { verifyJwt, isUserAdmin } from "../middlewares/auth.middlewares.js";

const projectRouter = express.Router();

projectRouter.post("/projects/create", verifyJwt, isUserAdmin, createProject);

projectRouter.get("/projects", getAllProjects);

projectRouter.get("/projects/:name", getProjectByName);

projectRouter.put("/projects/:id/update", verifyJwt, isUserAdmin, updateProject);

projectRouter.patch("/projects/:id/update-photo", verifyJwt, isUserAdmin, updateProjectPhoto);

projectRouter.delete("/projects/:id", verifyJwt, isUserAdmin, deleteProject);


export default projectRouter;