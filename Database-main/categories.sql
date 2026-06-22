CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    category_name VARCHAR(100)
    UNIQUE NOT NULL,

    description TEXT
);
