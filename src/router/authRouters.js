const authController = require("../controller/authController");
const {
  registerValidationRules,
  loginValidationRules,
  refreshTokenValidationRules,
  validate,
} = require("../middleware/authValidation");

exports.register = {
  route: "/register",
  handler: [registerValidationRules, validate, authController.register],
};

exports.login = {
  route: "/login",
  handler: [loginValidationRules, validate, authController.login],
};

exports.refreshToken = {
  route: "/refresh-token",
  handler: [
    refreshTokenValidationRules,
    validate,
    authController.refreshToken,
  ],
};


