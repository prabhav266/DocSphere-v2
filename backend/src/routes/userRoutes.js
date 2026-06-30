const express = require("express");

const router = express.Router();

const {
  profileImageUpload,
} = require("../middleware/uploadMiddleware");

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
  profileImageUpload.single("image"),
  uploadProfileImage
);

module.exports = router;
