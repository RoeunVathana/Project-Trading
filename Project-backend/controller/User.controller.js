const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op, col, fn, where } = require("sequelize");
const { User } = require("../models");
const { logError } = require("../middlewares/LogError");
const { getImageUrl, removeImage } = require("../utils/Upload");

const discardUploadedImage = (req) => {
  if (req.file) removeImage(getImageUrl(req.file));
};

const publicUser = (user) => ({
  id: user.id,
  name: user.username,
  username: user.username,
  email: user.email,
  profileImage: user.profileImage,
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

const parseUserId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const parseUserPayload = (body, { requirePassword = false, allowEmpty = false } = {}) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object." };
  }

  const values = {};
  const hasUsername = Object.prototype.hasOwnProperty.call(body, "username") || Object.prototype.hasOwnProperty.call(body, "name");
  const usernameValue = body.username ?? body.name;

  if (hasUsername) {
    if (typeof usernameValue !== "string" || !usernameValue.trim()) {
      return { error: "name or username is required." };
    }
    const username = usernameValue.trim().toLowerCase();
    if (username.length > 100) return { error: "name cannot exceed 100 characters." };
    values.username = username;
  }

  if (Object.prototype.hasOwnProperty.call(body, "email")) {
    if (typeof body.email !== "string" || !body.email.trim()) {
      return { error: "A valid email is required." };
    }
    const email = body.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "A valid email is required." };
    }
    if (email.length > 254) return { error: "email cannot exceed 254 characters." };
    values.email = email;
  }

  if (Object.prototype.hasOwnProperty.call(body, "password")) {
    if (typeof body.password !== "string" || body.password.length < 8) {
      return { error: "password must contain at least 8 characters." };
    }
    if (Buffer.byteLength(body.password, "utf8") > 72) {
      return { error: "password cannot exceed 72 bytes when using bcrypt." };
    }
    values.password = body.password;
  } else if (requirePassword) {
    return { error: "password must contain at least 8 characters." };
  }

  if (Object.keys(values).length === 0 && !allowEmpty) {
    return { error: "Provide at least one supported user field." };
  }

  return { values };
};

const findDuplicateUser = async (values, ignoredId) => {
  const duplicateWhere = {
    [Op.or]: [
      where(fn("LOWER", col("username")), values.username || ""),
      where(fn("LOWER", col("email")), values.email || ""),
    ],
  };
  if (ignoredId) duplicateWhere.id = { [Op.ne]: ignoredId };
  return User.findOne({ where: duplicateWhere });
};

const register = async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      discardUploadedImage(req);
      return res.status(400).json({
        success: false,
        message: "Request body must be a JSON object.",
      });
    }

    const usernameValue = body.username ?? body.name;
    const emailValue = body.email;
    const password = body.password;

    if (typeof usernameValue !== "string" || !usernameValue.trim()) {
      discardUploadedImage(req);
      return res.status(400).json({
        success: false,
        message: "name or username is required.",
      });
    }
    if (typeof emailValue !== "string" || !emailValue.trim()) {
      discardUploadedImage(req);
      return res.status(400).json({
        success: false,
        message: "A valid email is required.",
      });
    }
    if (typeof password !== "string" || password.length < 8) {
      discardUploadedImage(req);
      return res.status(400).json({
        success: false,
        message: "password must contain at least 8 characters.",
      });
    }
    if (Buffer.byteLength(password, "utf8") > 72) {
      discardUploadedImage(req);
      return res.status(400).json({
        success: false,
        message: "password cannot exceed 72 bytes when using bcrypt.",
      });
    }

    const username = usernameValue.trim().toLowerCase();
    const email = emailValue.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      discardUploadedImage(req);
      return res.status(400).json({
        success: false,
        message: "A valid email is required.",
      });
    }
    if (username.length > 100 || email.length > 254) {
      discardUploadedImage(req);
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
      discardUploadedImage(req);
      return res.status(409).json({
        success: false,
        message: "That name or email is already registered.",
      });
    }

    // The User model hashes password changes in its beforeSave hook.
    const user = await User.create({
      username,
      email,
      password,
      profileImage: req.file ? getImageUrl(req.file) : null,
    });
    return res.status(201).json({
      success: true,
      message: "Account created.",
      data: publicUser(user),
    });
  } catch (error) {
    discardUploadedImage(req);
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

const getUsers = async (_req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "profileImage"],
      order: [["id", "DESC"]],
    });
    return res.status(200).json({ success: true, data: users.map(publicUser) });
  } catch (error) {
    return logError("UserList", error, res, "Unable to retrieve users.");
  }
};

const updateUser = async (req, res) => {
  let imageSaved = false;
  try {
    const id = parseUserId(req.params.id);
    if (!id) {
      discardUploadedImage(req);
      return res.status(400).json({ success: false, message: "User id must be a positive integer." });
    }

    const { values = {}, error } = parseUserPayload(req.body || {}, { allowEmpty: Boolean(req.file) });
    if (error) {
      discardUploadedImage(req);
      return res.status(400).json({ success: false, message: error });
    }

    const user = await User.findByPk(id);
    if (!user) {
      discardUploadedImage(req);
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const duplicate = await findDuplicateUser(values, id);
    if (duplicate) {
      discardUploadedImage(req);
      return res.status(409).json({ success: false, message: "That name or email is already registered." });
    }

    const previousImage = user.profileImage;
    if (req.file) values.profileImage = getImageUrl(req.file);
    await user.update(values);
    imageSaved = true;
    if (previousImage && previousImage !== user.profileImage) removeImage(previousImage);

    return res.status(200).json({ success: true, data: publicUser(user) });
  } catch (error) {
    if (!imageSaved) discardUploadedImage(req);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ success: false, message: "That name or email is already registered." });
    }
    return logError("UserUpdate", error, res, "Unable to update the user.");
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = parseUserId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "User id must be a positive integer." });
    }
    if (String(req.user?.sub) === String(id)) {
      return res.status(409).json({ success: false, message: "You cannot delete the account you are currently using." });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    await user.destroy();
    removeImage(user.profileImage);
    return res.status(200).json({ success: true, message: "User deleted." });
  } catch (error) {
    return logError("UserDelete", error, res, "Unable to delete the user.");
  }
};

module.exports = { register, login, getCurrentUser, getUsers, updateUser, deleteUser };
