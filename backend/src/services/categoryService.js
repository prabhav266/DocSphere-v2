const pool = require("../config/db");

const getAllCategories = async () => {
  const result = await pool.query(
    "SELECT * FROM categories"
  );

  return result.rows;
};

module.exports = {
  getAllCategories,
};