const crypto = require("crypto");
const pool = require("../config/db");

const documentSelect = `
  SELECT
    d.*,
    c.category_name,
    f.folder_name,
    COALESCE(
      json_agg(t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL),
      '[]'
    ) AS tags
  FROM documents d
  LEFT JOIN categories c ON c.id = d.category_id
  LEFT JOIN folders f ON f.id = d.folder_id
  LEFT JOIN document_tags dt ON dt.document_id = d.id
  LEFT JOIN tags t ON t.id = dt.tag_id
`;

const commonWords = new Set([
  "the", "and", "for", "with", "from", "that", "this", "into", "your",
  "about", "document", "report", "file", "data", "are", "was", "were",
  "has", "have", "will", "can", "you", "our", "not", "all", "new",
]);

const generateTagsFromText = (...parts) => {
  const text = parts.filter(Boolean).join(" ").toLowerCase();
  const words = text.match(/[a-z0-9]{4,}/g) || [];
  const counts = new Map();

  words.forEach((word) => {
    if (!commonWords.has(word)) {
      counts.set(word, (counts.get(word) || 0) + 1);
    }
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([word]) => word);
};

const getAllDocuments = async () => {
  const result = await pool.query(
  `${documentSelect}
   WHERE d.status = 'approved'
   GROUP BY d.id, c.category_name, f.folder_name
   ORDER BY d.created_at DESC`
);

  return result.rows;
};

const getDocumentById = async (id) => {
  const result = await pool.query(
    `${documentSelect}
     WHERE d.id = $1
     AND d.status = 'approved'
     GROUP BY d.id, c.category_name, f.folder_name`,
    [id]
  );

  return result.rows[0];
};

const getDocumentByShareToken = async (token) => {
  const result = await pool.query(
    `${documentSelect}
     WHERE d.share_token = $1
AND d.status = 'approved'
AND (d.share_expires_at IS NULL OR d.share_expires_at > NOW())
     GROUP BY d.id, c.category_name, f.folder_name`,
    [token]
  );

  return result.rows[0];
};

const getDocumentsByUserId = async (userId) => {
  const result = await pool.query(
    `${documentSelect}
     WHERE d.uploaded_by = $1
     GROUP BY d.id, c.category_name, f.folder_name
     ORDER BY
       CASE
         WHEN d.status = 'pending' THEN 1
         WHEN d.status = 'approved' THEN 2
         WHEN d.status = 'rejected' THEN 3
         ELSE 4
       END,
       d.created_at DESC`,
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
visibility,
status
)
   VALUES
($1,$2,$3,$4,$5,$6,$7,$8,$9)
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
  "pending",
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

const searchDocuments = async ({
  query = "",
  type,
  visibility,
  dateRange,
  uploadedBy,
} = {}) => {
  const clauses = [];
  clauses.push("d.status = 'approved'");
  const values = [];

  const addValue = (value) => {
    values.push(value);
    return `$${values.length}`;
  };

  if (uploadedBy) {
    clauses.push(`d.uploaded_by = ${addValue(uploadedBy)}`);
  }

  if (query) {
    const placeholder = addValue(`%${query}%`);
    clauses.push(`(
      d.title ILIKE ${placeholder}
      OR d.description ILIKE ${placeholder}
      OR d.extracted_text ILIKE ${placeholder}
      OR t.tag_name ILIKE ${placeholder}
    )`);
  }

  if (type && type !== "All") {
    clauses.push(`d.file_type ILIKE ${addValue(`%${type}%`)}`);
  }

  if (visibility && visibility !== "all") {
    clauses.push(`d.visibility = ${addValue(visibility)}`);
  }

  if (dateRange === "7d") {
    clauses.push("d.created_at >= NOW() - INTERVAL '7 days'");
  } else if (dateRange === "30d") {
    clauses.push("d.created_at >= NOW() - INTERVAL '30 days'");
  } else if (dateRange === "year") {
    clauses.push("d.created_at >= date_trunc('year', NOW())");
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const result = await pool.query(
    `${documentSelect}
     ${where}
     GROUP BY d.id, c.category_name, f.folder_name
     ORDER BY d.created_at DESC`,
    values
  );

  return result.rows;
};

const updateExtractedText = async (documentId, extractedText) => {
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

const updateAiSummary = async (documentId, summary) => {
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

const setDocumentTags = async (documentId, tagNames = []) => {
  const normalizedTags = [...new Set(
    tagNames
      .map((tag) => tag?.trim().toLowerCase())
      .filter(Boolean)
  )].slice(0, 8);

  if (normalizedTags.length === 0) return [];

  await pool.query("DELETE FROM document_tags WHERE document_id = $1", [documentId]);

  const savedTags = [];
  for (const tagName of normalizedTags) {
    const tagResult = await pool.query(
      `INSERT INTO tags (tag_name)
       VALUES ($1)
       ON CONFLICT (tag_name) DO UPDATE SET tag_name = EXCLUDED.tag_name
       RETURNING id, tag_name`,
      [tagName]
    );

    const tag = tagResult.rows[0];
    await pool.query(
      `INSERT INTO document_tags (document_id, tag_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [documentId, tag.id]
    );
    savedTags.push(tag.tag_name);
  }

  return savedTags;
};

const generateAndSaveDocumentTags = async (documentId, { title, description, extractedText }) => {
  const tags = generateTagsFromText(title, description, extractedText);
  return setDocumentTags(documentId, tags);
};

const createShareToken = async (id, expiresInDays = 7) => {
  const token = crypto.randomBytes(24).toString("hex");
  const result = await pool.query(
    `UPDATE documents
     SET share_token = $1,
         share_expires_at = NOW() + ($2::int * INTERVAL '1 day'),
         updated_at = NOW()
     WHERE id = $3
     RETURNING share_token, share_expires_at`,
    [token, expiresInDays, id]
  );

  return result.rows[0];
};

const getDocumentAnalytics = async (userId) => {
  const params = [];
  const where = userId ? "WHERE uploaded_by = $1" : "";
  if (userId) params.push(userId);

  const totals = await pool.query(
    `SELECT
       COUNT(*)::int AS total_documents,
       COALESCE(SUM(file_size), 0)::bigint AS total_storage_bytes,
       COALESCE(SUM(total_views), 0)::int AS total_views,
       COALESCE(SUM(total_downloads), 0)::int AS total_downloads,
       COUNT(*) FILTER (WHERE visibility = 'public')::int AS public_documents,
       COUNT(*) FILTER (WHERE visibility = 'private')::int AS private_documents,
       COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS recent_uploads
     FROM documents
     ${where}`,
    params
  );

  const byType = await pool.query(
    `SELECT file_type, COUNT(*)::int AS count
     FROM documents
     ${where}
     GROUP BY file_type
     ORDER BY count DESC`,
    params
  );

  const topDocuments = await pool.query(
    `SELECT id, title, total_views, total_downloads, file_type
     FROM documents
     ${where}
     ORDER BY (total_views + total_downloads) DESC, created_at DESC
     LIMIT 5`,
    params
  );

  return {
    ...totals.rows[0],
    by_type: byType.rows,
    top_documents: topDocuments.rows,
  };
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
  getDocumentByShareToken,
  getDocumentsByUserId,
  createDocument,
  incrementViews,
  incrementDownloads,
  searchDocuments,
  updateExtractedText,
  updateAiSummary,
  generateAndSaveDocumentTags,
  createShareToken,
  getDocumentAnalytics,
  deleteDocumentById,
};
