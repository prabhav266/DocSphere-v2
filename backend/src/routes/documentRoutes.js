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
  shareDocument,
  fetchSharedDocument,
  fetchAnalytics,
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

router.get("/analytics", protect, fetchAnalytics);

router.get("/search", searchDocument);

router.get("/shared/:token", fetchSharedDocument);

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

router.post(
  "/:id/share",
  protect,
  shareDocument
);

router.get("/:id/download", downloadDocument);
router.get("/:id", getDocument);

module.exports = router;
