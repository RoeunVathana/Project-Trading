const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../Public/image');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, fileName);
  },
});

// Allowed types
const allowedTypes = ['.jpg', '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.bmp',
  '.svg',
  '.tiff'
];
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) cb(null, true);
  else cb(new Error('Only JPG, JPEG, PNG, GIF, and WEBP files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Middleware for single file upload (any field name)
const uploadAny = (req, res, next) => {
  upload.any()(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'File too large. Max size is 10MB.',
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || 'Invalid file upload',
    });
  });
};

const deleteImageFolder = (filePath) => {
  if (!filePath) return;

  // const cleanedPath = filePath.replace(/^\/image\//, '');
  const clearnedPath = path.join(__dirname,  "../../public")
  const fullPath = path.join(clearnedPath, filePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

module.exports = { uploadAny, deleteImageFolder };