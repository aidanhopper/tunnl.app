-- migrate:up
CREATE TABLE IF NOT EXISTS update_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- migrate:down
DROP TABLE IF EXISTS update_messages;
