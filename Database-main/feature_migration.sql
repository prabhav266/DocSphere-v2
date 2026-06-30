-- Run this against an existing DocSphere database before using share links:
--   psql -U postgres -d docsphere -f Database-main/feature_migration.sql

ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS extracted_text TEXT,
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS share_expires_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_documents_share_token ON documents(share_token);
CREATE INDEX IF NOT EXISTS idx_documents_visibility ON documents(visibility);
