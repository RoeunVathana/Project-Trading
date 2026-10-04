const jwt = require("jsonwebtoken");
const { logError } = require("./LogError");

const Authorization = (req, res, next) => {
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

    req.user = payload;
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

// Keep the previous factory export available for existing route imports.
module.exports = Authorization;
module.exports.Authorization = Authorization;
module.exports.validate_token = () => Authorization;
