const express = require("express");
const router = express.Router();
const budgetController = require("../controller/budgetController");
const authenticateJWT = require("../middleware/authMiddleware");
const {
  setBudgetValidationRules,
  budgetSummaryValidationRules,
  validateBudget,
} = require("../middleware/budgetValidation");

// Set or update a monthly budget (Protected)
router.post(
  "/",
  authenticateJWT,
  setBudgetValidationRules,
  validateBudget,
  budgetController.setBudget,
);

// Get all budgets list (Protected)
router.get("/", authenticateJWT, budgetController.getBudgets);

// Get monthly budgets vs actual spent summary analytics (Protected)
router.get(
  "/summary",
  authenticateJWT,
  budgetSummaryValidationRules,
  validateBudget,
  budgetController.getBudgetSummary,
);

module.exports = router;
