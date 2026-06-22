CREATE TABLE tags (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    tag_name VARCHAR(50)
    UNIQUE NOT NULL
);
