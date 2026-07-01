const pool = require("../config/db");

const getPendingUsers = async () => {
  const result = await pool.query(
    `
    SELECT
      id,
      username,
      email,
      created_at
    FROM users
    WHERE status = 'pending'
      AND role = 'user'
    ORDER BY created_at ASC
    `
  );

  return result.rows;
};

const approveUser = async (userId, adminId) => {
  const result = await pool.query(
    `
    UPDATE users
    SET
      status = 'approved',
      approved_by = $2,
      approved_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [userId, adminId]
  );

  return result.rows[0];
};

const getPendingDocuments = async () => {
  const result = await pool.query(`
    SELECT
      documents.*,
      users.username
    FROM documents
    JOIN users
      ON documents.uploaded_by = users.id
    WHERE documents.status = 'pending'
    ORDER BY documents.created_at DESC
  `);

  return result.rows;
};

const approveDocument = async (documentId, adminId) => {
  const result = await pool.query(
    `
    UPDATE documents
    SET
      status = 'approved',
      approved_by = $2,
      approved_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [documentId, adminId]
  );

  return result.rows[0];
};

const rejectDocument = async (documentId, reason = null) => {
  const result = await pool.query(
    `
    UPDATE documents
    SET
      status = 'rejected',
      rejection_reason = $2
    WHERE id = $1
    RETURNING *
    `,
    [documentId, reason]
  );

  return result.rows[0];
};

const rejectUser = async (userId) => {
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id = $1
    RETURNING *
    `,
    [userId]
  );

  return result.rows[0];
};

module.exports = {
  getPendingUsers,
  approveUser,
  rejectUser,

  getPendingDocuments,
  approveDocument,
  rejectDocument,
};