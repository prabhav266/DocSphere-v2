const {
  getAllCategories,
} = require("../services/categoryService");

const fetchCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  fetchCategories,
};