const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { randomUUID } = require("crypto");
const { logError } = require("../middlewares/LogError");

const imageDirectory = path.resolve(__dirname, "../Public/image");
const imageUrlPrefix = "/image/";
const videoDirectory = path.resolve(__dirname, "../Public/video");
const videoUrlPrefix = "/video/";
const MAX_IMAGE_SIZE_MB = 100;
const MAX_IMAGE_FILE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_VIDEO_SIZE_MB = 250;
const MAX_VIDEO_FILE_SIZE = MAX_VIDEO_SIZE_MB * 1024 * 1024;
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
const allowedVideoExtensions = new Set([
  ".mp4",
  ".webm",
  ".mov",
  ".m4v",
  ".avi",
  ".mkv",
  ".mpeg",
  ".mpg",
  ".ogv",
  ".3gp",
]);

fs.mkdirSync(imageDirectory, { recursive: true });
fs.mkdirSync(videoDirectory, { recursive: true });

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
  limits: { fileSize: MAX_IMAGE_FILE_SIZE },
});

const machineMediaStorage = multer.diskStorage({
  destination: (_req, file, callback) => {
    callback(null, file.fieldname === "video" ? videoDirectory : imageDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${randomUUID()}${extension}`;
    callback(null, safeName);
  },
});

const machineMediaUpload = multer({
  storage: machineMediaStorage,
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (file.fieldname === "image" && allowedExtensions.has(extension)) {
      return callback(null, true);
    }

    const isVideoMime =
      file.mimetype === "application/octet-stream" || file.mimetype.startsWith("video/");
    if (file.fieldname === "video" && allowedVideoExtensions.has(extension) && isVideoMime) {
      return callback(null, true);
    }

    return callback(new Error(
      file.fieldname === "video"
        ? "Only supported video files are allowed."
        : "Only image files are allowed.",
    ));
  },
  limits: {
    fileSize: MAX_VIDEO_FILE_SIZE,
    files: 2,
  },
});

const getUploadedFiles = (req) => Object.values(req.files || {}).flat();

const discardMachineMedia = (req) => {
  getUploadedFiles(req).forEach((file) => {
    if (file.fieldname === "video") removeVideo(getVideoUrl(file));
    else removeImage(getImageUrl(file));
  });
};

const uploadMachineMedia = (req, res, next) => {
  machineMediaUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ])(req, res, (error) => {
    if (error) {
      discardMachineMedia(req);
      const isTooLarge =
        error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE";
      return res.status(isTooLarge ? 413 : 400).json({
        success: false,
        message: isTooLarge
          ? `Video too large. Maximum size is ${MAX_VIDEO_SIZE_MB}MB.`
          : error.message,
      });
    }

    const imageFile = req.files?.image?.[0];
    const videoFile = req.files?.video?.[0];
    if (imageFile && imageFile.size > MAX_IMAGE_FILE_SIZE) {
      discardMachineMedia(req);
      return res.status(413).json({
        success: false,
        message: `Image too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`,
      });
    }

    req.file = imageFile;
    req.videoFile = videoFile;
    return next();
  });
};

const uploadImage = (req, res, next) => {
  multerUpload.single("image")(req, res, (error) => {
    if (!error) return next();

    const isTooLarge =
      error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE";
    return res.status(isTooLarge ? 413 : 400).json({
      success: false,
      message: isTooLarge
        ? `Image too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`
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

const getVideoUrl = (file) =>
  file ? `${videoUrlPrefix}${file.filename}` : null;

const removeVideo = (videoUrl) => {
  if (typeof videoUrl !== "string" || !videoUrl.startsWith(videoUrlPrefix)) return;

  const filename = videoUrl.slice(videoUrlPrefix.length);
  if (!filename || path.basename(filename) !== filename) return;

  const videoPath = path.resolve(videoDirectory, filename);
  if (!videoPath.startsWith(`${videoDirectory}${path.sep}`)) return;

  try {
    fs.unlinkSync(videoPath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      void logError("VideoFileCleanup", error);
    }
  }
};

module.exports = {
  uploadImage,
  uploadMachineMedia,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  getImageUrl,
  getVideoUrl,
  removeImage,
  removeVideo,
};
