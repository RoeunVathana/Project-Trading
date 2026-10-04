const fs = require("fs/promises");
const path = require("path");
const moment = require("moment");
const { validationResult } = require("express-validator");

const logError = async (
  controller,
  error,
  res,
  responseMessage = "Internal Server Error",
) => {
  const label = String(controller || "Application").replace(/[^a-z0-9_-]/gi, "_");
  const timestamp = moment().format("DD/MM/YYYY HH:mm:ss");
  const logDirectory = path.resolve(__dirname, "../logs");
  const filePath = path.join(logDirectory, `${label}-${moment().format("YYYY-MM-DD")}.txt`);
  const errorMessage = error instanceof Error ? error.message : String(error || "Unknown error");
  const errorStack = error instanceof Error ? error.stack || "" : "";

  try {
    await fs.mkdir(logDirectory, { recursive: true });
    await fs.appendFile(
      filePath,
      `[${timestamp}] [${label}] ${errorMessage}\n${errorStack}\n`,
      "utf8",
    );
  } catch (logWriteError) {
    console.error("Error writing to the application log:", logWriteError);
  }

  if (res && !res.headersSent) {
    return res.status(500).json({
      success: false,
      message: responseMessage,
    });
  }
};

const validateCheck = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ errors: errors.array() });
};

module.exports = { logError, validateCheck };
