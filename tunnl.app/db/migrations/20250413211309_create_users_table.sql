-- migrate:up
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(128) UNIQUE NOT NULL,
    last_login TIMESTAMPTZ DEFAULT NOW(),
    roles TEXT NOT NULL DEFAULT ''
);

-- migrate:down
DROP TABLE users;
