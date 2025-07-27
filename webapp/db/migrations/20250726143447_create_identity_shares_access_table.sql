-- migrate:up
CREATE TABLE identity_shares_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_id UUID NOT NULL,
    share_id UUID NOT NULL,
    FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
    FOREIGN KEY (share_id) REFERENCES shares(id) ON DELETE CASCADE,
    UNIQUE (identity_id, share_id)
);

-- migrate:down
DROP TABLE identity_shares_access;
