import { body, validationResult, check } from "express-validator";

// Constants for file validation
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

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
  body("name").escape().trim().notEmpty(),
  body("gitHub").escape().trim().notEmpty(),
  body("description").escape().trim().notEmpty(),
  body("techStack").isArray().notEmpty(),
  body("status").escape().trim().notEmpty().isIn(["Not started", "In Progress", "Completed"]),
  check().custom((value, { req }) => {
    // Custom file validation using express-validator's custom method
    if (!req.file) {
      throw new Error('Project image is required');
    }
    
    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }
    
    // Check file size
    // if (req.file.size > MAX_FILE_SIZE) {
    //   throw new Error('File size must be less than 5MB');
    // }
    
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }
    res.status(422).json({ errors: errors.array() });
  },
];

export const validateUpdateProject = [
  body("name").optional().escape().trim().notEmpty(),
  body("gitHub").optional().escape().trim().notEmpty(),
  body("description").optional().escape().trim().notEmpty(),
  body("techStack").optional().isArray().notEmpty(),
  body("status").optional().escape().trim().notEmpty().isIn(["Not started", "In Progress", "Completed"]),
  check().custom((value, { req }) => {
    // Custom file validation (optional for updates)
    if (req.file) {
      // Check file type if file is provided
      if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
        throw new Error('Only JPEG, PNG, and WebP images are allowed');
      }
      
      // Check file size
      // if (req.file.size > MAX_FILE_SIZE) {
      //   throw new Error('File size must be less than 5MB');
      // }
    }
    
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }
    res.status(422).json({ errors: errors.array() });
  },
];