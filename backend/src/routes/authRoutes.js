const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.get("/", (req, res) => {
  res.send("Auth Route Working");
});

module.exports = router;