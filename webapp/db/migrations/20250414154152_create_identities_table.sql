-- migrate:up
CREATE TABLE identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    ziti_id VARCHAR(16) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    last_seen TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id, name)
);

-- migrate:down
DROP TABLE identities;
