const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { randomUUID } = require("crypto");
const { logError } = require("../middlewares/LogError");

const imageDirectory = path.resolve(__dirname, "../Public/image");
const imageUrlPrefix = "/image/";
const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".svg",
  ".tif",
  ".tiff",
]);

fs.mkdirSync(imageDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, imageDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${randomUUID()}${extension}`;
    callback(null, safeName);
  },
});

const multerUpload = multer({
  storage,
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.has(extension)) return callback(null, true);
    return callback(new Error("Only image files are allowed."));
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadImage = (req, res, next) => {
  multerUpload.single("image")(req, res, (error) => {
    if (!error) return next();

    const isTooLarge =
      error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE";
    return res.status(isTooLarge ? 413 : 400).json({
      success: false,
      message: isTooLarge
        ? "File too large. Maximum size is 10MB."
        : error.message,
    });
  });
};

const getImageUrl = (file) =>
  file ? `${imageUrlPrefix}${file.filename}` : null;

const removeImage = (imageUrl) => {
  if (typeof imageUrl !== "string" || !imageUrl.startsWith(imageUrlPrefix))
    return;

  const filename = imageUrl.slice(imageUrlPrefix.length);
  if (!filename || path.basename(filename) !== filename) return;

  const imagePath = path.resolve(imageDirectory, filename);
  if (!imagePath.startsWith(`${imageDirectory}${path.sep}`)) return;

  try {
    fs.unlinkSync(imagePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      void logError("ImageFileCleanup", error);
    }
  }
};

module.exports = {
  uploadImage,
  getImageUrl,
  removeImage,
};
