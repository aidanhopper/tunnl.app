-- migrate:up
CREATE TABLE service_dials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL,
    dials SMALLINT NOT NULL,
    service_id UUID NOT NULL,
    UNIQUE (service_id, timestamp),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE service_dials;
