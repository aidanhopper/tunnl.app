-- migrate:up
CREATE OR REPLACE FUNCTION is_valid_port_range_list(input TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  token TEXT;
  start_port INT;
  end_port INT;
BEGIN
  IF input IS NULL OR input = '' THEN
    RETURN FALSE;
  END IF;

  FOREACH token IN ARRAY regexp_split_to_array(input, '\s+') LOOP
    IF token ~ '^\d+$' THEN
      -- Single port
      start_port := token::INT;
      IF start_port < 1 OR start_port > 65535 THEN
        RETURN FALSE;
      END IF;
    ELSIF token ~ '^\d+-\d+$' THEN
      -- Port range
      start_port := split_part(token, '-', 1)::INT;
      end_port := split_part(token, '-', 2)::INT;
      IF start_port < 1 OR end_port > 65535 OR start_port >= end_port THEN
        RETURN FALSE;
      END IF;
    ELSE
      -- Invalid token
      RETURN FALSE;
    END IF;
  END LOOP;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- migrate:down
DROP FUNCTION is_valid_port_range_list(TEXT);
