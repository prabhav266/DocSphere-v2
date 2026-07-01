const { findUserById } = require("../services/userService");

const adminMiddleware = async (req, res, next) => {
  try {
    console.log("Decoded Token:", req.user);

    const user = await findUserById(req.user.id);

    console.log("Database User:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    next();
  } catch (err) {
    console.error("ADMIN MIDDLEWARE ERROR:");
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = adminMiddleware;