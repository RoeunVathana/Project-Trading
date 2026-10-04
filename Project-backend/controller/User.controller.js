const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op, col, fn, where } = require("sequelize");
const { User } = require("../models");
const { logError } = require("../middlewares/LogError");

const publicUser = (user) => ({
  id: user.id,
  name: user.username,
  username: user.username,
  email: user.email,
});

const createAccessToken = (user) => {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    throw new Error("TOKEN_SECRET is not configured.");
  }

  return jwt.sign(
    { username: user.username, email: user.email },
    secret,
    {
      subject: String(user.id),
      expiresIn: process.env.TOKEN_EXPIRES_IN || "1d",
    },
  );
};

const register = async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a JSON object.",
      });
    }

    const usernameValue = body.username ?? body.name;
    const emailValue = body.email;
    const password = body.password;

    if (typeof usernameValue !== "string" || !usernameValue.trim()) {
      return res.status(400).json({
        success: false,
        message: "name or username is required.",
      });
    }
    if (typeof emailValue !== "string" || !emailValue.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid email is required.",
      });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "password must contain at least 8 characters.",
      });
    }
    if (Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        success: false,
        message: "password cannot exceed 72 bytes when using bcrypt.",
      });
    }

    const username = usernameValue.trim().toLowerCase();
    const email = emailValue.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid email is required.",
      });
    }
    if (username.length > 100 || email.length > 254) {
      return res.status(400).json({
        success: false,
        message: "name or email is too long.",
      });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          where(fn("LOWER", col("username")), username),
          where(fn("LOWER", col("email")), email),
        ],
      },
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "That name or email is already registered.",
      });
    }

    // The User model hashes password changes in its beforeSave hook.
    const user = await User.create({ username, email, password });
    return res.status(201).json({
      success: true,
      message: "Account created.",
      data: publicUser(user),
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      await logError("UserRegister", error);
      return res.status(409).json({
        success: false,
        message: "That name or email is already registered.",
      });
    }
    return logError("UserRegister", error, res, "Unable to create the account.");
  }
};

const login = async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a JSON object.",
      });
    }

    const identifierValue =
      body.identifier ?? body.login ?? body.name ?? body.username ?? body.email;
    const password = body.password;
    if (typeof identifierValue !== "string" || !identifierValue.trim()) {
      return res.status(400).json({
        success: false,
        message: "Enter your name or email.",
      });
    }
    if (typeof password !== "string" || !password) {
      return res.status(400).json({
        success: false,
        message: "password is required.",
      });
    }

    const identifier = identifierValue.trim().toLowerCase();
    const user = await User.findOne({
      where: {
        [Op.or]: [
          where(fn("LOWER", col("username")), identifier),
          where(fn("LOWER", col("email")), identifier),
        ],
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid name/email or password.",
      });
    }

    const token = createAccessToken(user);
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { token, user: publicUser(user) },
    });
  } catch (error) {
    return logError("UserLogin", error, res, "Unable to log in.");
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = Number(req.user?.sub);
    if (!Number.isSafeInteger(userId) || userId < 1) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, data: publicUser(user) });
  } catch (error) {
    return logError("UserProfile", error, res, "Unable to retrieve the user.");
  }
};

module.exports = { register, login, getCurrentUser };
