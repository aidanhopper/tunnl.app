-- migrate:up
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(128) UNIQUE NOT NULL,
    last_login TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    roles TEXT NOT NULL DEFAULT ''
);

-- migrate:down
DROP TABLE IF EXISTS users;
