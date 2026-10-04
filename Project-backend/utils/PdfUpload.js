const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const multer = require("multer");
const { logError } = require("../middlewares/LogError");

const pdfDirectory = path.resolve(__dirname, "../Public/pdf");
const pdfUrlPrefix = "/pdf/";

fs.mkdirSync(pdfDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, pdfDirectory),
  filename: (_req, _file, callback) => {
    const filename = `${Date.now()}-${randomUUID()}.pdf`;
    callback(null, filename);
  },
});

const multerUpload = multer({
  storage,
  fileFilter: (_req, file, callback) => {
    if (path.extname(file.originalname).toLowerCase() === ".pdf") {
      return callback(null, true);
    }
    return callback(new Error("Only PDF files are allowed."));
  },
  limits: { fileSize: 25 * 1024 * 1024 },
});

const getPdfUrl = (file) => (file ? `${pdfUrlPrefix}${file.filename}` : null);

const removePdf = (fileUrl) => {
  if (typeof fileUrl !== "string" || !fileUrl.startsWith(pdfUrlPrefix)) return;

  const filename = fileUrl.slice(pdfUrlPrefix.length);
  if (!filename || path.basename(filename) !== filename) return;

  const filePath = path.resolve(pdfDirectory, filename);
  if (!filePath.startsWith(`${pdfDirectory}${path.sep}`)) return;

  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      void logError("PdfFileCleanup", error);
    }
  }
};

const getPdfMetadata = (file) => ({
  fileName: path.basename(file.originalname.replace(/\\/g, "/")) || "document.pdf",
  filePath: getPdfUrl(file),
  fileSize: file.size,
});

const isPdfFile = (filePath) => {
  let descriptor;
  try {
    descriptor = fs.openSync(filePath, "r");
    const header = Buffer.alloc(5);
    const bytesRead = fs.readSync(descriptor, header, 0, header.length, 0);
    return bytesRead === header.length && header.toString("ascii") === "%PDF-";
  } catch (error) {
    void logError("PdfFileValidation", error);
    return false;
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
  }
};

const uploadPdf = (req, res, next) => {
  multerUpload.single("file")(req, res, (error) => {
    if (error) {
      const isTooLarge = error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE";
      return res.status(isTooLarge ? 413 : 400).json({
        success: false,
        message: isTooLarge ? "PDF too large. Maximum size is 25MB." : error.message,
      });
    }

    if (req.file && !isPdfFile(req.file.path)) {
      removePdf(getPdfUrl(req.file));
      return res.status(400).json({
        success: false,
        message: "The uploaded file is not a valid PDF.",
      });
    }

    return next();
  });
};

module.exports = {
  uploadPdf,
  getPdfUrl,
  getPdfMetadata,
  removePdf,
};
