-- migrate:up
CREATE TABLE ziti_hosts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    forward_ports BOOLEAN NOT NULL,
    protocol protocol CHECK (protocol IN ('tcp', 'udp')),
    ziti_id VARCHAR(32) NOT NULL,
    CHECK (
        (forward_ports = TRUE AND protocol IS NULL) OR 
        (forward_ports = FALSE AND protocol IN ('tcp', 'udp'))
    ),
    address INET NOT NULL,
    CHECK (
        (family(address) = 4 AND masklen(address) = 32) OR
        (family(address) = 6 AND masklen(address) = 128)
    ),
    forward_port BOOLEAN NOT NULL,
    allowed_port_ranges TEXT,
    CHECK (
        (forward_port = TRUE AND allowed_port_ranges IS NOT NULL AND is_valid_port_range_list(allowed_port_ranges)) OR
        (forward_port = FALSE AND allowed_port_ranges IS NULL)
    ),
    port VARCHAR(5),
    CHECK (
        (forward_port = FALSE AND is_valid_port(port)) OR
        (forward_port = TRUE AND port IS NULL)
    )
);

-- migrate:down
DROP TABLE ziti_hosts;
