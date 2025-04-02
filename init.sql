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

-- COMMUNITIES TABLE

CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (owner_id, name)
);

-- MEMBERS TABLE

CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    community_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
    UNIQUE (user_id, community_id)
);

-- SHARES TABLE

CREATE TABLE IF NOT EXISTS shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL,
    member_id UUID NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE, 
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE (service_id, member_id)
);

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
