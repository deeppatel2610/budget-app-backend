const { body, validationResult } = require("express-validator");
const AuthModel = require("../model/authModel");
const sendResponse = require("../utils/sendResponse");

// Validation rules for Register
const registerValidationRules = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name must contain only letters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Last name must contain only letters"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .custom(async (value) => {
      const user = await AuthModel.findUserByUsername(value);
      if (user) {
        throw new Error("Username is already taken");
      }
      return true;
    }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail()
    .custom(async (value) => {
      const user = await AuthModel.findUserByEmail(value);
      if (user) {
        throw new Error("Email is already registered");
      }
      return true;
    }),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Please enter a valid phone number")
    .custom(async (value) => {
      const user = await AuthModel.findUserByPhoneNumber(value);
      if (user) {
        throw new Error("Phone number is already registered");
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Validation rules for Login
const loginValidationRules = [
  body("emailOrUsername")
    .trim()
    .notEmpty()
    .withMessage("Email or username is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// Validation rules for Refresh Token
const refreshTokenValidationRules = [
  body("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("Refresh token is required"),
];

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return the first validation error message
    return sendResponse(res, 400, false, null, errors.array()[0].msg);
  }
  next();
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  refreshTokenValidationRules,
  validate,
};
