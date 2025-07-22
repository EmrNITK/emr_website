import asyncHandler from "../utils/asyncHandler.js";
import Project from "../models/Projects.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// create a new project
const createProject = asyncHandler(async (req, res) => {
    const { Name, GitHub, Description, techStack, Status } = req.body;
    if (!Name || !GitHub || !Description || !techStack || !Status) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    
    const existedProject = await Project.findOne({ Name });
    if (existedProject) {
        return res.status(400).json({ message: "Project with this name already exists" });
    }

    const photoLocalPath = req.file?.path;
    if (!photoLocalPath) {
        return res.status(400).json({ message: "Please provide a photo" });
    }
    const photo = await uploadOnCloudinary(photoLocalPath);

const newProject = await Project.create({
    Name,
    GitHub,
    Description,
    techStack,
    photo: photo ? photo.secure_url : null,
    Status,
});

res
.status(201)
.json({ message: "Project created successfully", project: newProject });
});


// get all projects
const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find().sort({ createdAt: -1 });
    if (!projects || projects.length === 0) {
        return res.status(404).json({ message: "No projects found" });
    }
    res
    .status(200)
    .json({ projects });
});

// get a single project by id
const getProjectById = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }
    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }
    res
    .status(200)
    .json({ project });
});

// update project by ID 
const updateProjectById = asyncHandler(async (req, res) => {
    const { Name, GitHub, Description, techStack, Status } = req.body;
    const projectId = req.params.projectId;
    const photoLocalPath = req.file?.path;

    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }

    // Prepare update object
    const updateFields = {};

    // Update regular fields if provided and not empty/null
    if (Name !== undefined && Name !== null && Name !== "") {
        updateFields.Name = Name;
    }
    if (GitHub !== undefined && GitHub !== null && GitHub !== "") {
        updateFields.GitHub = GitHub;
    }
    if (Description !== undefined && Description !== null && Description !== "") {
        updateFields.Description = Description;
    }
    if (techStack !== undefined && techStack !== null && techStack !== "") {
        updateFields.techStack = techStack;
    }
    if (Status !== undefined && Status !== null && Status !== "") {
        updateFields.Status = Status;
    }

    // Update photo if provided
    if (photoLocalPath) {
        const photo = await uploadOnCloudinary(photoLocalPath);
        if (!photo) {
            return res.status(500).json({ message: "Failed to upload photo" });
        }
        updateFields.photo = photo.secure_url;
    }

    // Check if there's anything to update
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "No fields provided to update" });
    }

    const project = await Project.findByIdAndUpdate( 
        projectId,
        { $set: updateFields },
        { new: true ,
          runValidators: true
        }
    );

    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    res
    .status(200)
    .json({ message: "Project updated successfully", project });
});


// delete a project
const deleteProject = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    res
    .status(200)
    .json({ message: "Project deleted successfully" });
});

export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProject
};












