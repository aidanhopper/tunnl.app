-- migrate:up
CREATE OR REPLACE FUNCTION is_valid_domain_list(input TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  domain TEXT;
BEGIN
  IF input IS NULL OR input = '' THEN
    RETURN FALSE;
  END IF;

  FOREACH domain IN ARRAY regexp_split_to_array(input, '\s+') LOOP
    IF NOT domain ~* '^([a-z0-9]([-a-z0-9]*[a-z0-9])?\.)+[a-z]{2,}$' THEN
      RETURN FALSE;
    END IF;
  END LOOP;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- migrate:down
DROP FUNCTION is_valid_domain_list(TEXT);
