const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const authenticateJWT = require("../middleware/authMiddleware");
const {
  categoryValidationRules,
  validateCategory,
} = require("../middleware/categoryValidation");

// Get all categories (Protected)
router.get("/", authenticateJWT, categoryController.getCategories);

// Create custom category (Protected)
router.post(
  "/",
  authenticateJWT,
  categoryValidationRules,
  validateCategory,
  categoryController.createCategory,
);

module.exports = router;
