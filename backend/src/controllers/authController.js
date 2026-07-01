const bcrypt = require("bcryptjs");

const {
  findUserByEmail,
  createUser,
} = require("../services/userService");

const generateToken = require("../utils/generateToken");

const buildUserResponse = (user) => ({
  id: user.id,
  username: user.username,
  full_name: user.username,
  email: user.email,
  role: user.role || "user",
  token: generateToken(user.id),
});

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const trimmedUsername = username?.trim();
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedUsername || !trimmedEmail || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    const existingUser = await findUserByEmail(trimmedEmail);

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(trimmedUsername, trimmedEmail, passwordHash);

    res.status(201).json({
  success: true,
  message:
    "Registration successful. Your account is awaiting administrator approval.",
});
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: error.message || "Registration failed",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await findUserByEmail(trimmedEmail);

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }
    if (user.status !== "approved") {
  return res.status(403).json({
    message:
      "Your account is awaiting administrator approval.",
  });
}

    const isMatch = await bcrypt.compare(password, user.password_hash || "");

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    res.status(200).json(buildUserResponse(user));
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};