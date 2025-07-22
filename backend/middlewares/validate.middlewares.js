import { body, validationResult } from "express-validator";

// Constants for file validation
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Simple custom validation functions
export const validateImageFile = () => {
  return body().custom((value, { req }) => {
    if (!req.file) {
      throw new Error('Image file is required');
    }
    
    if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }
    
    return true;
  });
};

export const validateOptionalImageFile = () => {
  return body().custom((value, { req }) => {
    if (req.file && !ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }
    return true;
  });
};


export const validateRegistration = [
  body("name").escape().trim(),
  body("email").isEmail(),
  body("rollno").escape().trim(),
  body("password").escape().trim(),
  body("branch").escape().trim(),
  body("mobileNo").escape().trim(),
  body("collegeName").escape().trim(),
  body("kaggleUserName").escape().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return ;
    }
    res.status(422).json(errors);
  },
];
export const validateLogin = [
  body("email").isEmail(),
  body("password").escape().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next(); 
      return;
      
    }
    return res.status(422).json({ errors: errors.array() });
  }
];

export const validateCreateEvent =[
  body("name").escape().trim().notEmpty(),
  body("date").escape().isDate().notEmpty(),
  body("venue").escape().notEmpty(),
  body("description").escape().notEmpty(),
  body("numberOfMember").escape().isInt({min:1}),
  body("poster").escape().trim().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return ;
    }
    res
    .status(422)
    .json({errors:errors.array()});
  },
]


export const validateCreateProject = [
  
  body("name").escape().trim().notEmpty().withMessage("Project name is required"),
  body("gitHub").escape().trim().notEmpty().withMessage("GitHub URL is required"),
  body("description").escape().trim().notEmpty().withMessage("Description is required"),
  body("techStack").custom((value) => {
    // Handle both JSON string and array formats
    let techArray;
    if (typeof value === 'string') {
      try {
        techArray = JSON.parse(value);
      } catch (e) {
        // If it's not JSON, treat as comma-separated string
        techArray = value.split(',').map(tech => tech.trim()).filter(tech => tech);
      }
    } else if (Array.isArray(value)) {
      techArray = value;
    } else {
      throw new Error('Tech stack must be an array or comma-separated string');
    }
    
    if (!Array.isArray(techArray) || techArray.length === 0) {
      throw new Error('Tech stack must contain at least one technology');
    }
    
    return true;
  }),
  body("status").escape().trim().notEmpty().isIn(["Not started", "In Progress", "Completed"]).withMessage("Status must be 'Not started', 'In Progress', or 'Completed'"),
  validateImageFile(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }
    console.log(" Validation errors:", errors.array());
    res.status(422).json({ errors: errors.array() });
  },
];

export const validateUpdateProject = [
  body("name").optional().escape().trim().notEmpty(),
  body("gitHub").optional().escape().trim().notEmpty(),
  body("description").optional().escape().trim().notEmpty(),
  body("techStack").custom((value) => {
    // Handle both JSON string and array formats for updates
    // For updates, techStack is required if provided
    if (value === undefined || value === null || value === '') {
      throw new Error('Tech stack is required');
    }
    
    let techArray;
    if (typeof value === 'string') {
      try {
        techArray = JSON.parse(value);
      } catch (e) {
        // If it's not JSON, treat as comma-separated string
        techArray = value.split(',').map(tech => tech.trim()).filter(tech => tech);
      }
    } else if (Array.isArray(value)) {
      techArray = value;
    } else {
      throw new Error('Tech stack must be an array or comma-separated string');
    }
    
    if (!Array.isArray(techArray) || techArray.length === 0) {
      throw new Error('Tech stack must contain at least one technology');
    }
    
    return true;
  }),
  body("status").optional().escape().trim().notEmpty().isIn(["Not started", "In Progress", "Completed"]),
  validateOptionalImageFile(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }
    res.status(422).json({ errors: errors.array() });
  },
];