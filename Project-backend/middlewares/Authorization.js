const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { logError } = require("./LogError");

const USER_ROLES = Object.freeze(["admin", "staff"]);
const PERMISSION_ACTIONS = Object.freeze(["view", "create", "update", "delete"]);
const PERMISSION_RESOURCES = Object.freeze([
  "machines",
  "categories",
  "gallery",
  "specs",
  "pdfs",
  "huawei",
  "huaweicategories",
  "huaweiimages",
  "huaweipdfs",
]);

const normalizePermissions = (value) => {
  let entries = value;
  if (typeof entries === "string") {
    try {
      entries = JSON.parse(entries);
    } catch {
      entries = entries.split(",");
    }
  }
  if (!Array.isArray(entries)) return [];

  return [...new Set(entries
    .filter((permission) => typeof permission === "string")
    .map((permission) => permission.trim().toLowerCase())
    .filter((permission) => {
      const [resource, action] = permission.split(":");
      return PERMISSION_RESOURCES.includes(resource) && PERMISSION_ACTIONS.includes(action);
    }))];
};

const hasPermission = (user, resource, action) => {
  if (user?.role === "admin") return true;
  const permission = `${String(resource).trim().toLowerCase()}:${String(action).trim().toLowerCase()}`;
  return normalizePermissions(user?.permissions).includes(permission);
};

const Authorization = async (req, res, next) => {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    const error = new Error("TOKEN_SECRET is not configured.");
    void logError("Authorization", error);
    return res.status(500).json({
      success: false,
      message: "Authentication is not configured.",
    });
  }

  const authorization = req.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({
      success: false,
      message: "A Bearer token is required.",
    });
  }

  try {
    const payload = jwt.verify(match[1].trim(), secret);
    if (!payload || typeof payload !== "object" || !payload.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    const user = await User.findByPk(payload.sub, {
      attributes: ["id", "username", "email", "role", "permissions", "profileImage"],
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    req.user = {
      ...payload,
      sub: String(user.id),
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: normalizePermissions(user.permissions),
      profileImage: user.profileImage,
    };
    req.account = user;
    return next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }
    return logError("Authorization", error, res, "Unable to verify the token.");
  }
};

const requireRole = (...roles) => {
  const allowedRoles = roles.flat().filter((role) => USER_ROLES.includes(role));

  return (req, res, next) => {
    if (!allowedRoles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }
    return next();
  };
};

const requirePermission = (resource, action) => (req, res, next) => {
  const normalizedResource = String(resource).trim().toLowerCase();
  const normalizedAction = String(action).trim().toLowerCase();
  if (!PERMISSION_RESOURCES.includes(normalizedResource) || !PERMISSION_ACTIONS.includes(normalizedAction)) {
    return res.status(500).json({
      success: false,
      message: "Invalid permission configuration.",
    });
  }
  if (!hasPermission(req.user, normalizedResource, normalizedAction)) {
    return res.status(403).json({
      success: false,
      message: `You do not have ${action} permission for ${resource}.`,
    });
  }
  return next();
};

// Keep the previous factory export available for existing route imports.
module.exports = Authorization;
module.exports.Authorization = Authorization;
module.exports.validate_token = () => Authorization;
module.exports.requireRole = requireRole;
module.exports.requirePermission = requirePermission;
module.exports.hasPermission = hasPermission;
module.exports.normalizePermissions = normalizePermissions;
module.exports.USER_ROLES = USER_ROLES;
module.exports.PERMISSION_ACTIONS = PERMISSION_ACTIONS;
module.exports.PERMISSION_RESOURCES = PERMISSION_RESOURCES;
