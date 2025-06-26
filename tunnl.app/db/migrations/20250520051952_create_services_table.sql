-- migrate:up
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    created TIMESTAMPTZ DEFAULT NOW(),
    slug VARCHAR(128) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    ziti_id VARCHAR(32) NOT NULL,
    protocol protocol NOT NULL CHECK (protocol IN ('http', 'tcp/udp')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (name, user_id)
);

-- migrate:down
DROP TABlE services;
