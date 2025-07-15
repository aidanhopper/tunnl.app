-- migrate:up
CREATE TYPE policy_type AS ENUM ('Bind', 'Dial');
CREATE TYPE policy_semantic AS ENUM ('AllOf', 'AnyOf');

CREATE TABLE ziti_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    ziti_id VARCHAR(32) NOT NULL,
    type policy_type NOT NULL,
    semantic policy_semantic NOT NULL,
    service_roles VARCHAR(164)[] NOT NULL,
    identity_roles VARCHAR(164)[] NOT NULL
);

-- migrate:down
DROP TABLE ziti_policies;
DROP TYPE policy_type;
DROP TYPE policy_semantic;
