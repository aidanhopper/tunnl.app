-- migrate:up
CREATE TABLE ziti_intercepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ziti_id VARCHAR(32) NOT NULL,
    name VARCHAR(128) NOT NULL,
    port_ranges TEXT NOT NULL CHECK (is_valid_port_range_list(port_ranges)),
    protocol protocol NOT NULL CHECK (protocol IN ('tcp', 'udp', 'tcp/udp')),
    addresses  VARCHAR(128)[] NOT NULL
);

-- migrate:down
DROP TABLE ziti_intercepts;
