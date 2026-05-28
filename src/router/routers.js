const express = require("express");
const router = express.Router();

const authRouters = require("../router/authRouters");
const categoryRouters = require("./categoryRouters");
const transactionRouters = require("./transactionRouters");
const budgetRouters = require("./budgetRouters");

const { authLimiter } = require("../middleware/rateLimiter");

/// auth
router.post(
  "/register",
  authLimiter,
  authRouters.register.handler,
);
router.post("/login", authLimiter, authRouters.login.handler);
router.post(
  "/refresh-token",
  authLimiter,
  authRouters.refreshToken.handler,
);

// categories
router.use("/categories", categoryRouters);

// transactions
router.use("/transactions", transactionRouters);

// budgets
router.use("/budgets", budgetRouters);

module.exports = router;
