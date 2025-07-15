-- migrate:up
CREATE TYPE protocol AS ENUM ('http', 'tcp', 'udp', 'tcp/udp');

-- migrate:down
DROP TYPE protocol;
