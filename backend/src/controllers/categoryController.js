const {
  getAllCategories,
} = require("../services/categoryService");

const fetchCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.status(200).json({
      categories: categories || [],
    });
  } catch (error) {
    console.error("FETCH CATEGORIES ERROR:", error);

    res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

module.exports = {
  fetchCategories,
};