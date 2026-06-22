const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../uploads");

// Ensure the uploads directory exists regardless of cwd
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    // Sanitize original filename and avoid collisions
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, Date.now() + "-" + safeName);
  },
});

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const fileFilter = (req, file, cb) => {
  if (
    ALLOWED_MIME_TYPES.includes(file.mimetype) ||
    file.fieldname === "image" // profile image route is more permissive
  ) {
    return cb(null, true);
  }
  cb(new Error("Unsupported file type: " + file.mimetype));
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter,
});

module.exports = upload;
