const rateLimit = require("express-rate-limit");
const sendResponse = require("../utils/sendResponse");

// General API Rate Limiter: Max 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    return sendResponse(
      res,
      429,
      false,
      null,
      "Too many requests from this IP, please try again after 15 minutes.",
    );
  },
});

// Stricter Rate Limiter for Auth endpoints (Login / Register): Max 15 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendResponse(
      res,
      429,
      false,
      null,
      "Too many login or registration attempts. Please try again after 15 minutes.",
    );
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};
