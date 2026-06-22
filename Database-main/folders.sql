CREATE TABLE folders (
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
