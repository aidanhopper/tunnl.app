-- migrate:up
CREATE TABLE public_port_bindings (
    -- id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- private_binding UUID NOT NULL,
    -- port_range VARCHAR(5) UNIQUE NOT NULL CHECK (is_valid_port(port))
);

-- migrate:down
DROP TABLE public_port_bindings;
