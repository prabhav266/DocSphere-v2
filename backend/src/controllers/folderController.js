const pool = require("../config/db");

const getFolders = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM folders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user?.id]
    );

    res.status(200).json(result.rows || []);
  } catch (error) {
    console.error("GET FOLDERS ERROR:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

const createFolder = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const result = await pool.query(
      `
      INSERT INTO folders (user_id, name, description)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [req.user?.id, name.trim(), description?.trim() || ""]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("CREATE FOLDER ERROR:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

const updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await pool.query(
      `
      UPDATE folders
      SET name = COALESCE($1, name), description = COALESCE($2, description)
      WHERE id = $3 AND user_id = $4
      RETURNING *
      `,
      [name?.trim() || null, description?.trim() || null, id, req.user?.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE FOLDER ERROR:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM folders
      WHERE id = $3 AND user_id = $4
      RETURNING *
      `,
      [id, req.user?.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json({ message: "Folder deleted" });
  } catch (error) {
    console.error("DELETE FOLDER ERROR:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

module.exports = {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
};
