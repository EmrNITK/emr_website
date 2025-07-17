import asyncHandler from "../utils/asyncHandler.js";
import Project from "../models/Projects.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";


// create a new project
const createProject = asyncHandler(async (req, res) => {
    const { Name, GitHub, Description, techStack , Status } = req.body;
    if (!Name || !GitHub || !Description || !techStack) {
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
    const photo = await uploadonCloudinary(photoLocalPath);

    const newProject = await Project.create({
        Name,
        GitHub,
        Description,
        techStack,
        photo: photo ? photo.secure_url : null,
        Status: Status || "Not started",
    });

    const createdProject = await Project.findById(newProject._id);

    if (!createdProject) {
        return res.status(500).json({ message: "Failed to create project" });
    }

    res
    .status(201)
    .json({ message: "Project created successfully", project: createdProject });
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

// get a single project by Name
const getProjectByName = asyncHandler(async (req, res) => {
    const name = req.params.name.trim();
    // Use case-insensitive exact match
    const project = await Project.findOne({ Name: { $eq: name } }).collation({ locale: 'en', strength: 2 });
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project });
});

// update a project
const updateProject = asyncHandler(async (req, res) => {
    const { Name, GitHub, Description, techStack, Status } = req.body;

    if (!Name || !GitHub || !Description || !techStack) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    const project = await Project.findByIdAndUpdate( 
        req.project._id,
        {
            $set: {
                Name,
                GitHub,
                Description,
                techStack,
                Status: Status || "Not started",
            }
        },
        { new: true }
    );

    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    res
    .status(200)
    .json({ message: "Project updated successfully", project });
});

// update project photo
const updateProjectPhoto = asyncHandler(async (req, res) => {
    const photoLocalPath = req.file?.path;
    if (!photoLocalPath) {
        return res.status(400).json({ message: "Please provide a photo" });
    }

    const photo = await uploadonCloudinary(photoLocalPath);
    if (!photo) {
        return res.status(500).json({ message: "Failed to upload photo" });
    }

    const project = await Project.findByIdAndUpdate(
        req.project._id,
        { $set: { photo: photo.secure_url } },
        { new: true }
    );

    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    res
    .status(200)
    .json({ message: "Project photo updated successfully", project });
});


// delete a project
const deleteProject = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
});

export {
    createProject,
    getAllProjects,
    getProjectByName,
    updateProject,
    updateProjectPhoto,
    deleteProject
};












