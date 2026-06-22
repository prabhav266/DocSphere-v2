CREATE TABLE users (
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
