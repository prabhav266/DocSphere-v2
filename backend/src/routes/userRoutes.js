const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const { protect } = require("../middleware/authMiddleware");

const {
  uploadProfileImage,
  updateUser,
  getCurrentUser,
} = require("../controllers/userController");

router.get("/me", protect, getCurrentUser);

router.patch("/:id", protect, updateUser);

router.post(
  "/profile-image",
  protect,
  upload.single("image"),
  uploadProfileImage
);

module.exports = router;