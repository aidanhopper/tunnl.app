-- migrate:up
CREATE TABLE shares (
    id UUID PRIMARY KEY NOT NULL,
    tunnel_binding_id UUID NOT NULL, 
    user_id UUID NOT NULL,
    FOREIGN KEY (tunnel_binding_id) REFERENCES tunnel_bindings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE shares;
