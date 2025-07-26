-- migrate:up
CREATE TABLE share_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expires TIMESTAMPTZ NOT NULL,
    slug VARCHAR(32) UNIQUE NOT NULL,
    service_id UUID NOT NULL,
    one_time_use BOOLEAN NOT NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE share_links;
