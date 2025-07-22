import express from "express";
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProject
} from "../controllers/Project.controller.js";
import { verifyJwt, isUserAdmin } from "../middlewares/auth.middlewares.js";
import { upload, processBase64Files } from "../middlewares/multer.middleware.js";
import { validateCreateProject, validateUpdateProject } from "../middlewares/validate.middlewares.js";

const projectRouter = express.Router();

projectRouter.post("/", 
  verifyJwt, 
  isUserAdmin, 
  processBase64Files([{ name: "projectImg", filename: "project-image.jpg" }]),
  upload.single("projectImg"),
  validateCreateProject,
  createProject
);

projectRouter.get("/", getAllProjects);

projectRouter.get("/:projectId", getProjectById);

projectRouter.put("/:projectId", 
  verifyJwt, 
  isUserAdmin, 
  processBase64Files([{ name: "projectImg", filename: "project-image.jpg" }]),
  upload.single("projectImg"),
  validateUpdateProject,
  updateProjectById
);

projectRouter.delete("/:projectId", verifyJwt, isUserAdmin, deleteProject);


export default projectRouter;