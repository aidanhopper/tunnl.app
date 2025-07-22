-- migrate:up
CREATE TABLE private_https_bindings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    tunnel_binding_id UUID UNIQUE NOT NULL,
    slug VARCHAR(32) NOT NULL,
    domain VARCHAR(128) NOT NULL,
    ziti_id VARCHAR(32) NOT NULL,
    FOREIGN KEY (tunnel_binding_id) REFERENCES tunnel_bindings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (domain, user_id)
);

-- migrate:down
DROP TABLE private_https_bindings;
