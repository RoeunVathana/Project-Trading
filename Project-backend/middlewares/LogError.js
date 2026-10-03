const fs = require("fs/promises");
const moment = require("moment");
const { validationResult } = require("express-validator");
const logError = async (controller,err,res) => {
    try {
        

        const timestamp = moment().format("DD/MM/YYYY HH:mm:ss");
        const folderPath = "./logs";
        const filePath = `${folderPath}/${controller + moment().format("YYYY-MM-DD") }.txt`;
        // Create "logs" folder if missing
        await fs.mkdir(folderPath, { recursive: true });
        const logMessage = `[${timestamp}] [${controller}] ${err.message}\n${err.stack || ''}\n`;

        await fs.appendFile(filePath, logMessage);

    } catch (error) {
        console.error("Error writing to log file:", error);
    }

    res.status(500).send("Internal Server Error!");
};

const validateCheck = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  // const extractedErrors = [];
  // errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));
  return res.status(400).json({
    errors: errors.array(),
  });
};

module.exports = {logError, validateCheck };