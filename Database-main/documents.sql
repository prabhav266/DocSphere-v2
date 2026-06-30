CREATE TABLE documents (

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
