const express = require("express");

const {
  fetchCategories,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", fetchCategories);

module.exports = router;