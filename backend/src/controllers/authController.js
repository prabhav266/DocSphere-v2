const bcrypt = require("bcryptjs");

const {
  findUserByEmail,
  createUser,
} = require("../services/userService");

const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } =
      req.body;

    const existingUser =
      await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 10);

    const user = await createUser(
      username,
      email,
      passwordHash
    );

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
  console.error("REGISTER ERROR:", error);

  res.status(500).json({
    message: error.message,
  });
}
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user =
      await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};