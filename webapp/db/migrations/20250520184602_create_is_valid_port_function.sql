-- migrate:up
CREATE FUNCTION is_valid_port(VARCHAR(5))
RETURNS boolean AS $$
  SELECT $1 ~ '^\d{1,5}$' AND $1::int BETWEEN 1 AND 65535;
$$ LANGUAGE sql IMMUTABLE;

-- migrate:down
DROP FUNCTION is_valid_port
