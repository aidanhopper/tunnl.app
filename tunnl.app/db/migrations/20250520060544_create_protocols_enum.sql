-- migrate:up
CREATE TYPE protocol AS ENUM ('https', 'tcp', 'udp', 'tcp/udp');

-- migrate:down
DROP TYPE protocol;
