import asyncHandler from "../utils/asyncHandler.js";
import Project from "../models/Projects.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";


// create a new project
const createProject = asyncHandler(async (req, res) => {
   
    let { name, gitHub, description, techStack, status } = req.body;

    // Handle techStack conversion for form-data
    if (typeof techStack === 'string') {
        try {
            techStack = JSON.parse(techStack);
        } catch (e) {
            // If it's not JSON, treat as comma-separated string
            techStack = techStack.split(',').map(tech => tech.trim()).filter(tech => tech);
        }
    }

    // Safety net validation (in case middleware is bypassed)
    if (!name || !gitHub || !description || !techStack || !status) {
        return res.status(400).json({ 
            message: "Please fill all the fields",
            debug: {
                name: !!name,
                gitHub: !!gitHub,
                description: !!description,
                techStack: !!techStack,
                status: !!status
            }
        });
    }

    const existedProject = await Project.findOne({ name });
    if (existedProject) {
        return res.status(400).json({ message: "Project with this name already exists" });
    }

    const photoLocalPath = req.file?.path;
    if (!photoLocalPath) {
        return res.status(400).json({ message: "Please provide a photo" });
    }
    
    const photo = await uploadOnCloudinary(photoLocalPath);

    const newProject = await Project.create({
        name,
        gitHub,
        description,
        techStack,
        projectImg: photo ? photo.secure_url : null,
        status,
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
    let { name, gitHub, description, techStack, status } = req.body;
    const projectId = req.params.projectId;
    const photoLocalPath = req.file?.path;

    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }

    // Handle techStack conversion for form-data
    if (techStack && typeof techStack === 'string') {
        try {
            techStack = JSON.parse(techStack);
        } catch (e) {
            // If it's not JSON, treat as comma-separated string
            techStack = techStack.split(',').map(tech => tech.trim()).filter(tech => tech);
        }
    }

    // Safety net validation for update fields (in case middleware is bypassed)
    if (name === "" || gitHub === "" || description === "" || status === "") {
        return res.status(400).json({ message: "Fields cannot be empty" });
    }

    // Prepare update object
    const updateFields = {};

    // Update fields if provided
    if (name) updateFields.name = name;
    if (gitHub) updateFields.gitHub = gitHub;
    if (description) updateFields.description = description;
    if (techStack) updateFields.techStack = techStack;
    if (status) updateFields.status = status;

    
    if (req.file) {
        // Get the existing project to delete old image
        const existingProject = await Project.findById(projectId);
        
        const photo = await uploadOnCloudinary(req.file.path);
        if (!photo) {
            return res.status(500).json({ message: "Failed to upload project image" });
        }
        
        // Delete old image from Cloudinary if it exists
        if (existingProject && existingProject.projectImg) {
            await deleteFromCloudinary(existingProject.projectImg);
        }
        
        updateFields.projectImg = photo.secure_url;
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

    // Delete the image from Cloudinary if it exists
    if (project.projectImg) {
        await deleteFromCloudinary(project.projectImg);
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












