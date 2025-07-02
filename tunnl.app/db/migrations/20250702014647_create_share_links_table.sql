-- migrate:up
CREATE TABLE share_links (
    id UUID PRIMARY KEY NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    slug VARCHAR(32) NOT NULL,
    tunnel_binding_id UUID NOT NULL,
    FOREIGN KEY (tunnel_binding_id) REFERENCES shares(tunnel_binding_id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE share_links;
