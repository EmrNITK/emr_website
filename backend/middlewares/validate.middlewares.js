import { body, validationResult } from "express-validator";

export const validateRegistration = [
  body("name").escape().trim(),
  body("email").isEmail(),
  body("rollno").escape().trim(),
  body("password").escape().trim(),
  // body("branch").escape().trim(),
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
  body("name").escape().trim(),
  body("date").escape().isdate(),
  body("venue").escape().notEmpty(),
  body("description").escape().notEmpty(),
  body("numberOfMemeber").escape().isInt({min:1}),
  body("poster").escape().trim(),
  body("isLive").escape().isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return ;
    }
    res
    .status(422)
    .json({message:"please enter a valid credentials",errors});
  },
]