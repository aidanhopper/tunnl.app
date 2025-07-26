-- migrate:up
CREATE TABLE service_dials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL,
    dials SMALLINT NOT NULL,
    tunnel_binidng_id UUID NOT NULL,
    UNIQUE (tunnel_binidng_id, timestamp),
    FOREIGN KEY (tunnel_binidng_id) REFERENCES services(id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE service_dials;
