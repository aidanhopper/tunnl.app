-- migrate:up
CREATE TABLE update_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- migrate:down
DROP TABLE update_messages;
