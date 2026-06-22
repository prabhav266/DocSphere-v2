const multer = require("multer");

// 404 handler — must be registered after all routes
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// Centralized error handler — must be registered last
const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File is too large. Max size is 50MB." });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err.message && err.message.startsWith("Unsupported file type")) {
    return res.status(400).json({ message: err.message });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Server Error",
  });
};

module.exports = { notFound, errorHandler };
