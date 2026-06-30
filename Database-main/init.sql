-- DocSphere database initialization script
-- Run this once against a fresh database, e.g.:
--   psql -U postgres -d docsphere -f init.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    role VARCHAR(20) DEFAULT 'user'
    CHECK(role IN ('user','admin')),

    bio TEXT,
    profile_image TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- FOLDERS
CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

    folder_name VARCHAR(255) NOT NULL,

    parent_folder_id UUID
    REFERENCES folders(id)
    ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    category_name VARCHAR(100)
    UNIQUE NOT NULL,

    description TEXT
);

-- DOCUMENTS
CREATE TABLE IF NOT EXISTS documents (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    uploaded_by UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

    folder_id UUID
    REFERENCES folders(id)
    ON DELETE SET NULL,

    category_id UUID
    REFERENCES categories(id)
    ON DELETE SET NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    file_name VARCHAR(255) NOT NULL,

    file_url TEXT NOT NULL,

    file_type VARCHAR(50) NOT NULL,

    file_size BIGINT NOT NULL,

    preview_image TEXT,

    -- Used by documentService.updateExtractedText / updateAiSummary
    extracted_text TEXT,
    ai_summary TEXT,

    share_token TEXT UNIQUE,
    share_expires_at TIMESTAMP,

    total_views INTEGER DEFAULT 0,

    total_downloads INTEGER DEFAULT 0,

    visibility VARCHAR(20)
    DEFAULT 'public'
    CHECK (visibility IN ('public','private')),

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()
);

-- TAGS
CREATE TABLE IF NOT EXISTS tags (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    tag_name VARCHAR(50)
    UNIQUE NOT NULL
);

-- DOCUMENT_TAGS (join table)
CREATE TABLE IF NOT EXISTS document_tags (

    document_id UUID
    REFERENCES documents(id)
    ON DELETE CASCADE,

    tag_id UUID
    REFERENCES tags(id)
    ON DELETE CASCADE,

    PRIMARY KEY(document_id, tag_id)
);

-- SEARCH HISTORY
CREATE TABLE IF NOT EXISTS search_history (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID
    REFERENCES users(id)
    ON DELETE CASCADE,

    search_query TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

-- DOCUMENT EMBEDDINGS (for future AI/semantic search work)
CREATE TABLE IF NOT EXISTS document_embeddings (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    document_id UUID UNIQUE
    REFERENCES documents(id)
    ON DELETE CASCADE,

    embedding_model VARCHAR(100),

    embedding_vector JSONB,

    created_at TIMESTAMP DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_title ON documents USING gin (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_share_token ON documents(share_token);
CREATE INDEX IF NOT EXISTS idx_documents_visibility ON documents(visibility);

-- Seed a couple of default categories so the dropdown isn't empty
INSERT INTO categories (category_name, description) VALUES
  ('General', 'Uncategorized documents'),
  ('Reports', 'Reports and analyses'),
  ('Finance', 'Financial documents')
ON CONFLICT (category_name) DO NOTHING;
