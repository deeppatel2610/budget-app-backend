const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transactionController");
const authenticateJWT = require("../middleware/authMiddleware");
const {
  createTransactionValidationRules,
  updateTransactionValidationRules,
  validateTransaction,
} = require("../middleware/transactionValidation");

// CRUD Endpoints (All Protected)
router.post(
  "/",
  authenticateJWT,
  createTransactionValidationRules,
  validateTransaction,
  transactionController.createTransaction,
);

router.get("/", authenticateJWT, transactionController.getTransactions);

router.get("/:id", authenticateJWT, transactionController.getTransactionDetails);

router.put(
  "/:id",
  authenticateJWT,
  updateTransactionValidationRules,
  validateTransaction,
  transactionController.updateTransaction,
);

router.delete("/:id", authenticateJWT, transactionController.deleteTransaction);

module.exports = router;
