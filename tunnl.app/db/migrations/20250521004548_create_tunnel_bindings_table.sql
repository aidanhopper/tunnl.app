-- migrate:up
CREATE TABLE tunnel_bindings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL,
    host_id UUID NOT NULL,
    intercept_id UUID NOT NULL,
    dial_policy_id UUID NOT NULL,
    bind_policy_id UUID NOT NULL,
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (host_id) REFERENCES ziti_hosts(id),
    FOREIGN KEY (intercept_id) REFERENCES ziti_intercepts(id),
    FOREIGN KEY (dial_policy_id) REFERENCES ziti_policies(id),
    FOREIGN KEY (bind_policy_id) REFERENCES ziti_policies(id)
);

CREATE OR REPLACE FUNCTION enforce_binding_policy_type()
RETURNS TRIGGER AS $$
BEGIN
  -- Check dial_policy_id is a binding policy
  IF NEW.dial_policy_id IS NOT NULL THEN
    PERFORM 1 FROM policies WHERE id = NEW.dial_policy_id AND type = 'dial';
    IF NOT FOUND THEN
      RAISE EXCEPTION 'dial_policy_id % must reference a policy of type dial', NEW.dial_policy_id;
    END IF;
  END IF;

  -- Check bind_policy_id is a binding policy
  IF NEW.bind_policy_id IS NOT NULL THEN
    PERFORM 1 FROM policies WHERE id = NEW.bind_policy_id AND type = 'binding';
    IF NOT FOUND THEN
      RAISE EXCEPTION 'bind_policy_id % must reference a policy of type binding', NEW.bind_policy_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_binding_policy_type
BEFORE INSERT OR UPDATE ON tunnel_bindings
FOR EACH ROW
EXECUTE FUNCTION enforce_binding_policy_type();

-- migrate:down
DROP TRIGGER check_binding_policy_type ON tunnel_bindings;
DROP FUNCTION enforce_binding_policy_type;
DROP TABLE tunnel_bindings;
