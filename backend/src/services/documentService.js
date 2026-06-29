const pool = require("../config/db");

const getAllDocuments = async () => {
  const result = await pool.query(
    "SELECT * FROM documents ORDER BY created_at DESC"
  );

  return result.rows;
};

const getDocumentById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM documents WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

const getDocumentsByUserId = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM documents WHERE uploaded_by = $1 ORDER BY created_at DESC",
    [userId]
  );

  return result.rows;
};

const createDocument = async (
  uploaded_by,
  title,
  description,
  file_name,
  file_url,
  file_type,
  file_size,
  visibility
) => {
      console.log("file_type:", file_type);
    console.log("length:", file_type.length);

  const result = await pool.query(
    `
    INSERT INTO documents
    (
      uploaded_by,
      title,
      description,
      file_name,
      file_url,
      file_type,
      file_size,
      visibility
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      uploaded_by,
      title,
      description,
      file_name,
      file_url,
      file_type,
      file_size,
      visibility,
    ]
  );

  return result.rows[0];
};

const incrementViews = async (id) => {
  await pool.query(
    `
    UPDATE documents
    SET total_views = total_views + 1
    WHERE id = $1
    `,
    [id]
  );
};
const incrementDownloads = async (id) => {
  await pool.query(
    `
    UPDATE documents
    SET total_downloads = total_downloads + 1
    WHERE id = $1
    `,
    [id]
  );
};

const searchDocuments = async (query) => {
  const result = await pool.query(
    `
    SELECT *
    FROM documents
    WHERE title ILIKE $1
    ORDER BY created_at DESC
    `,
    [`%${query}%`]
  );

  return result.rows;
};

const updateExtractedText = async (
  documentId,
  extractedText
) => {
  const result = await pool.query(
    `
    UPDATE documents
    SET extracted_text = $1
    WHERE id = $2
    RETURNING *
    `,
    [extractedText, documentId]
  );

  return result.rows[0];
};

const updateAiSummary = async (
  documentId,
  summary
) => {
  const result = await pool.query(
    `
    UPDATE documents
    SET ai_summary = $1
    WHERE id = $2
    RETURNING *
    `,
    [summary, documentId]
  );
   return result.rows[0];
};

const deleteDocumentById = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM documents
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  getDocumentsByUserId,
  createDocument,
  incrementViews,
  incrementDownloads,
  searchDocuments,
  updateExtractedText,
  updateAiSummary,
  deleteDocumentById,
};