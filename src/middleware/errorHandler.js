const sendResponse = require("../utils/sendResponse");

/**
 * Global Express Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the complete error stack for debugging
  console.error("💥 Global Error Catch:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server.";

  return sendResponse(res, statusCode, false, null, message);
};

module.exports = errorHandler;
