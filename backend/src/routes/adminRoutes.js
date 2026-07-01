const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getPendingUsersController,
  approveUserController,
  rejectUserController,

  getPendingDocumentsController,
  approveDocumentController,
  rejectDocumentController,
} = require("../controllers/adminController");

router.get(
  "/users/pending",
  protect,
  adminMiddleware,
  getPendingUsersController
);

router.get(
  "/documents/pending",
  protect,
  adminMiddleware,
  getPendingDocumentsController
);

router.put(
  "/documents/:id/approve",
  protect,
  adminMiddleware,
  approveDocumentController
);

router.put(
  "/documents/:id/reject",
  protect,
  adminMiddleware,
  rejectDocumentController
);

router.put(
  "/users/:id/approve",
  protect,
  adminMiddleware,
  approveUserController
);

router.delete(
  "/users/:id/reject",
  protect,
  adminMiddleware,
  rejectUserController
);

module.exports = router;