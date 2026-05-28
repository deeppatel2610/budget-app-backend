const sendResponse = require("../utils/sendResponse");
const AuthModel = require("../model/authModel");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/jwtHelper");

exports.register = async (req, res, next) => {
  const { firstName, lastName, username, phoneNumber, email, password } =
    req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await AuthModel.createUser(
      firstName,
      lastName,
      username,
      phoneNumber,
      email,
      hashedPassword,
    );
    sendResponse(res, 201, true, user);
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  const { emailOrUsername, password } = req.body;
  try {
    // 1. Find user by email or username
    let user = await AuthModel.findUserByEmail(emailOrUsername);
    if (!user) {
      user = await AuthModel.findUserByUsername(emailOrUsername);
    }

    if (!user) {
      return sendResponse(
        res,
        401,
        false,
        null,
        "Invalid email/username or password",
      );
    }

    // 2. Compare password hash
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return sendResponse(
        res,
        401,
        false,
        null,
        "Invalid email/username or password",
      );
    }

    // 3. Generate Access and Refresh Tokens
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 4. Save Refresh Token in the database
    await AuthModel.updateRefreshToken(user.id, refreshToken);

    // 5. Return user details and tokens (omit password_hash and stored refresh token)
    const userResponse = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      email: user.email,
      phoneNumber: user.phone_number,
    };

    sendResponse(res, 200, true, {
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (e) {
    next(e);
  }
};

exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  try {
    if (!refreshToken) {
      return sendResponse(res, 400, false, null, "Refresh token is required");
    }

    // 1. Verify Refresh Token structure/signature
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return sendResponse(
        res,
        401,
        false,
        null,
        "Invalid or expired refresh token",
      );
    }

    // 2. Check if user exists and token matches database record
    const user = await AuthModel.findUserByRefreshToken(refreshToken);
    if (!user) {
      return sendResponse(
        res,
        401,
        false,
        null,
        "Refresh token has been revoked or is invalid",
      );
    }

    // 3. Generate new Access and Refresh tokens (Rotation)
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // 4. Save new Refresh Token in the database (Revokes old one)
    await AuthModel.updateRefreshToken(user.id, newRefreshToken);

    sendResponse(res, 200, true, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (e) {
    next(e);
  }
};
