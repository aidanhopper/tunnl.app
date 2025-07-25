-- migrate:up
CREATE TABLE tunnel_bindings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL,
    ziti_host_id VARCHAR(32) NOT NULL,
    ziti_intercept_id VARCHAR(32) NOT NULL,
    ziti_dial_id VARCHAR(32) NOT NULL,
    ziti_bind_id VARCHAR(32) NOT NULL,
    ziti_service_id VARCHAR(32) NOT NULL,
    entry_point BOOLEAN NOT NULL,
    slug VARCHAR(64) UNIQUE NOT NULL,
    created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE tunnel_bindings;
