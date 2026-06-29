const express = require("express");

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  fetchDocuments,
  fetchMyDocuments,
  getDocument,
  uploadDocument,
  downloadDocument,
  searchDocument,
  deleteDocument,
} = require(
  "../controllers/documentController"
);

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", fetchDocuments);

router.get("/my", protect, fetchMyDocuments);

router.get("/search", searchDocument);

router.post(
  "/upload",
  protect,
  upload.single("document"),
  uploadDocument
);
router.delete(
  "/:id",
  protect,
  deleteDocument
);

router.get("/:id/download", downloadDocument);
router.get("/:id", getDocument);

module.exports = router;