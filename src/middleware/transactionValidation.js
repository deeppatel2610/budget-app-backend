const { body } = require("express-validator");
const { validate } = require("./authValidation");

// Validation rules for Transaction Creation
const createTransactionValidationRules = [
  body("categoryId")
    .optional({ nullable: true })
    .isInt()
    .withMessage("Category ID must be an integer"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive numeric value"),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["income", "expense"])
    .withMessage("Type must be either 'income' or 'expense'"),

  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string"),

  body("transactionDate")
    .optional()
    .isISO8601()
    .withMessage("Transaction date must be a valid date in ISO 8601 format"),
];

// Validation rules for Transaction Updates (all fields optional)
const updateTransactionValidationRules = [
  body("categoryId")
    .optional({ nullable: true })
    .isInt()
    .withMessage("Category ID must be an integer"),

  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive numeric value"),

  body("type")
    .optional()
    .trim()
    .isIn(["income", "expense"])
    .withMessage("Type must be either 'income' or 'expense'"),

  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string"),

  body("transactionDate")
    .optional()
    .isISO8601()
    .withMessage("Transaction date must be a valid date in ISO 8601 format"),
];

module.exports = {
  createTransactionValidationRules,
  updateTransactionValidationRules,
  validateTransaction: validate,
};
