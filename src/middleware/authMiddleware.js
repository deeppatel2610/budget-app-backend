const { verifyToken } = require("../utils/jwtHelper");
const sendResponse = require("../utils/sendResponse");

/**
 * Middleware to authenticate requests using JWT
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (decoded) {
      req.user = decoded; // Attach user payload to req (contains: id, email, username)
      return next();
    }
  }

  return sendResponse(
    res,
    401,
    false,
    null,
    "Access denied. Invalid or missing token.",
  );
};

module.exports = authenticateJWT;
