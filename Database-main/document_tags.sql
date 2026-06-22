CREATE TABLE document_tags (

    document_id UUID
    REFERENCES documents(id)
    ON DELETE CASCADE,

    tag_id UUID
    REFERENCES tags(id)
    ON DELETE CASCADE,

    PRIMARY KEY(document_id, tag_id)
);
