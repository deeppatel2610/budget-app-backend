const { body } = require("express-validator");
const { validate } = require("./authValidation");

// Validation rules for Category Creation
const categoryValidationRules = [
  body("name").trim().notEmpty().withMessage("Category name is required"),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Category type is required")
    .isIn(["income", "expense"])
    .withMessage("Category type must be either 'income' or 'expense'"),

  body("icon")
    .optional()
    .trim()
    .isString()
    .withMessage("Icon must be a string value"),

  body("color")
    .optional()
    .trim()
    .isString()
    .withMessage("Color must be a string value"),
];

module.exports = {
  categoryValidationRules,
  validateCategory: validate, // Reuses the validation result checker
};
