const pool = require("../config/db");
const {
  updateUserProfile,
  findUserById,
} = require("../services/userService");

const sanitizeUser = (user) => {
  if (!user) return user;
  const { password_hash, ...safeUser } = user;
  return safeUser;
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    await pool.query(
      `
      UPDATE users
      SET profile_image = $1
      WHERE id = $2
      `,
      [imagePath, req.user.id]
    );

    res.status(200).json({
      message: "Profile image updated",
      profile_image: imagePath,
    });
  } catch (error) {
    console.error("UPLOAD PROFILE IMAGE ERROR:", error);

    res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (id !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this profile",
      });
    }

    const { username, bio } = req.body;
    const updatedUser = await updateUserProfile(id, { username, bio });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(sanitizeUser(updatedUser));
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    console.error("GET CURRENT USER ERROR:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

module.exports = {
  uploadProfileImage,
  updateUser,
  getCurrentUser,
};
