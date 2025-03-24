\c postgres;

CREATE DATABASE app;

\c app;

-- USERS TABLE

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    google_id TEXT UNIQUE NOT NULL,
    picture TEXT NOT NULL,
    last_login TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION notify_user_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'user_updates',
    json_build_object(
      'user', row_to_json(NEW),
      'operation', TG_OP
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_update_trigger
AFTER INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION notify_user_update();

-- DEVICES TABLE

CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL,
    is_daemon_online BOOLEAN NOT NULL,
    is_tunnel_online BOOLEAN NOT NULL,
    is_tunnel_autostart BOOLEAN NOT NULL,
    dns_ip_range INET NOT NULL,
    hostname TEXT NOT NULL,
    display_name TEXT NOT NULL,
    last_login TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id, display_name)
);

CREATE OR REPLACE FUNCTION notify_device_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'device_updates',
    json_build_object(
      'device', row_to_json(NEW),
      'operation', TG_OP
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_device_delete()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'device_updates',
    json_build_object(
      'device', row_to_json(OLD),
      'operation', 'DELETE'
    )::text
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER device_update_trigger
AFTER INSERT OR UPDATE ON devices
FOR EACH ROW
EXECUTE FUNCTION notify_device_update();

CREATE TRIGGER device_delete_trigger
BEFORE DELETE ON devices
FOR EACH ROW
EXECUTE FUNCTION notify_device_delete();

-- SERVICES TABLE

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    device_id TEXT NOT NULL,
    name TEXT NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    host TEXT NOT NULL,
    port_range TEXT NOT NULL,
    source_port TEXT NOT NULL,
    access_port TEXT NOT NULL,
    are_ports_forwarded BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
    UNIQUE (user_id, name)
);

CREATE OR REPLACE FUNCTION notify_service_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'service_updates',
    json_build_object(
      'service', row_to_json(NEW),
      'operation', TG_OP
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_service_delete()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'service_updates',
    json_build_object(
      'service', row_to_json(OLD),
      'operation', 'DELETE'
    )::text
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER service_update_trigger
AFTER INSERT OR UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION notify_service_update();

CREATE TRIGGER service_delete_trigger
BEFORE DELETE ON services
FOR EACH ROW
EXECUTE FUNCTION notify_service_delete();

-- COMMUNITIES TABLE

CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (owner_id, name)
);

CREATE OR REPLACE FUNCTION notify_community_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'community_updates',
    json_build_object(
      'community', row_to_json(NEW),
      'members', (SELECT json_agg(user_id) FROM members WHERE community_id = NEW.id),
      'operation', TG_OP
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_community_delete()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'community_updates',
    json_build_object(
      'community', row_to_json(OLD),
      'members', (SELECT json_agg(user_id) FROM members WHERE community_id = OLD.id),
      'operation', 'DELETE'
    )::text
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER community_update_trigger
AFTER INSERT OR UPDATE ON communities
FOR EACH ROW
EXECUTE FUNCTION notify_community_update();

CREATE TRIGGER community_delete_trigger
BEFORE DELETE ON communities
FOR EACH ROW
EXECUTE FUNCTION notify_community_delete();

-- MEMBERS TABLE

CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    community_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
    UNIQUE (user_id, community_id)
);

CREATE OR REPLACE FUNCTION notify_member_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'member_updates',
    json_build_object(
      'members', (SELECT json_agg(user_id) FROM members WHERE community_id = NEW.community_id),
      'operation', TG_OP
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_member_delete()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'member_updates',
    json_build_object(
      'members', (SELECT json_agg(user_id) FROM members WHERE community_id = OLD.community_id),
      'operation', 'DELETE'
    )::text
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER member_update_trigger
AFTER INSERT OR UPDATE ON members
FOR EACH ROW
EXECUTE FUNCTION notify_member_update();

CREATE TRIGGER community_member_trigger
BEFORE DELETE ON members
FOR EACH ROW
EXECUTE FUNCTION notify_member_delete();

-- SHARES TABLE

CREATE TABLE IF NOT EXISTS shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL,
    member_id UUID NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE, 
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE (service_id, member_id)
);

CREATE OR REPLACE FUNCTION notify_share_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'share_updates',
    json_build_object(
      'share', row_to_json(NEW),
      'operation', TG_OP
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_share_delete()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'share_updates',
    json_build_object(
      'share', row_to_json(OLD),
      'operation', 'DELETE'
    )::text
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER share_update_trigger
AFTER INSERT OR UPDATE ON shares
FOR EACH ROW
EXECUTE FUNCTION notify_share_update();

CREATE TRIGGER share_delete_trigger
BEFORE DELETE ON shares
FOR EACH ROW
EXECUTE FUNCTION notify_share_delete();

-- INVITES TABLE

CREATE OR REPLACE FUNCTION gen_random_url() RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := '';
    i INT := 0;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INT, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS invites (
    id TEXT PRIMARY KEY DEFAULT gen_random_url(),
    community_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_one_time_use BOOLEAN NOT NULL,
    expires TIMESTAMP NOT NULL,
    FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE
);
