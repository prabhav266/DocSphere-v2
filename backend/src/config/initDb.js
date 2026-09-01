require("dotenv").config();
const pool = require("./db");
const bcrypt = require("bcryptjs");

const initDb = async () => {
  console.log("Initializing PostgreSQL Database Schema...");

  try {
    // 1. Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Table 'users' verified.");

    // 2. Documents Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        uploaded_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_type VARCHAR(100),
        file_size BIGINT DEFAULT 0,
        visibility VARCHAR(50) DEFAULT 'public',
        status VARCHAR(50) DEFAULT 'pending',
        rejection_reason TEXT,
        ai_summary TEXT,
        extracted_text TEXT,
        total_views INTEGER DEFAULT 0,
        total_downloads INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Table 'documents' verified.");

    // 3. Document Tags Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS document_tags (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        tag VARCHAR(100) NOT NULL
      );
    `);
    console.log("✓ Table 'document_tags' verified.");

    // 4. Document Shares Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS document_shares (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        share_token VARCHAR(255) UNIQUE NOT NULL,
        share_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Table 'document_shares' verified.");

    // 5. Seed Default Admin Account if Not Exists
    const adminCheck = await pool.query("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
    if (adminCheck.rows.length === 0) {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@docsphere.com";
      const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await pool.query(
        `INSERT INTO users (username, email, password_hash, role, status)
         VALUES ($1, $2, $3, 'admin', 'approved')`,
        ["Admin", adminEmail, hashedPassword]
      );
      console.log(`✓ Seeded default admin account: ${adminEmail}`);
    } else {
      console.log("✓ Admin account already exists.");
    }

    console.log("\nDatabase initialization completed successfully!");
  } catch (error) {
    console.error("Database initialization failed:", error);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  initDb();
}

module.exports = initDb;
