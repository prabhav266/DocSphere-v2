const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

const createUser = async (
  username,
  email,
  passwordHash
) => {
  const result = await pool.query(
`
INSERT INTO users
(
username,
email,
password_hash,
role,
status
)
VALUES
($1,$2,$3,$4,$5)
RETURNING *
`,
[
username,
email,
passwordHash,
"user",
"pending"
]
);

  return result.rows[0];
};

const updateUserProfile = async (id, { username, bio }) => {
  const result = await pool.query(
    `
    UPDATE users
    SET
      username = COALESCE($1, username),
      bio = COALESCE($2, bio),
      updated_at = NOW()
    WHERE id = $3
    RETURNING *
    `,
    [username, bio, id]
  );

  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserProfile,
};