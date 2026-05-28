const jwt = require("jsonwebtoken");
const { JWT } = require("./envVariables");

/**
 * Generate a short-lived Access Token
 * @param {Object} payload - User details (e.g. { id, email, username })
 * @returns {String} - Signed JWT Access Token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT, {
    expiresIn: "15m", // Access token valid for 15 minutes
  });
};

/**
 * Generate a long-lived Refresh Token
 * @param {Object} payload - User details (e.g. { id, email, username })
 * @returns {String} - Signed JWT Refresh Token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT, {
    expiresIn: "7d", // Refresh token valid for 7 days
  });
};

/**
 * Verify a JWT token (works for both access and refresh tokens)
 * @param {String} token - JWT token to verify
 * @returns {Object|null} - Decoded payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
