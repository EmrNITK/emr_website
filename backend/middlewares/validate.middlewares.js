import { body, validationResult } from "express-validator";

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

    console.log('good');
    
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