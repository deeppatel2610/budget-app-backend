const { body, query } = require("express-validator");
const { validate } = require("./authValidation");

// Validation rules for budget upsert
const setBudgetValidationRules = [
  body("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .isInt()
    .withMessage("Category ID must be an integer"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive numeric value"),

  body("month")
    .notEmpty()
    .withMessage("Month is required")
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be an integer between 1 and 12"),

  body("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Year must be a valid 4-digit integer"),
];

// Validation rules for budget summary query parameters
const budgetSummaryValidationRules = [
  query("month")
    .notEmpty()
    .withMessage("Query parameter 'month' is required")
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be an integer between 1 and 12"),

  query("year")
    .notEmpty()
    .withMessage("Query parameter 'year' is required")
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Year must be a valid 4-digit integer"),
];

module.exports = {
  setBudgetValidationRules,
  budgetSummaryValidationRules,
  validateBudget: validate,
};
