-- migrate:up
CREATE TABLE shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tunnel_binding_id UUID NOT NULL, 
    user_id UUID NOT NULL,
    FOREIGN KEY (tunnel_binding_id) REFERENCES tunnel_bindings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (tunnel_binding_id, user_id)
);

-- migrate:down
DROP TABLE shares;
