-- migrate:up
CREATE TABLE ziti_hosts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    forward_protocol BOOLEAN NOT NULL,
    protocol protocol CHECK (protocol IN ('tcp', 'udp')),
    ziti_id VARCHAR(32) NOT NULL,
    CHECK (
        (forward_protocol = TRUE AND protocol IS NULL) OR 
        (forward_protocol = FALSE AND protocol IN ('tcp', 'udp'))
    ),
    address VARCHAR(256) NOT NULL,
    CHECK (
        (family(address) = 4 AND masklen(address) = 32) OR
        (family(address) = 6 AND masklen(address) = 128)
    ),
    forward_ports BOOLEAN NOT NULL,
    allowed_port_ranges TEXT,
    CHECK (
        (forward_ports = TRUE AND allowed_port_ranges IS NOT NULL AND is_valid_port_range_list(allowed_port_ranges)) OR
        (forward_ports = FALSE AND allowed_port_ranges IS NULL)
    ),
    port VARCHAR(5),
    CHECK (
        (forward_ports = FALSE AND is_valid_port(port)) OR
        (forward_ports = TRUE AND port IS NULL)
    )
);

-- migrate:down
DROP TABLE ziti_hosts;
