-- migrate:up
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(128) UNIQUE NOT NULL,
    last_login TIMESTAMP DEFAULT NOW()
);

-- migrate:down
DROP TABLE users;
