\c postgres;

CREATE DATABASE networks;
CREATE DATABASE webapp;

\c networks;

CREATE TABLE IF NOT EXISTS users (
    userID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar(255) UNIQUE NOT NULL,
    hsUserID VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS devices (
    deviceID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userID UUID NOT NULL,
    hsDeviceID VARCHAR(255) UNIQUE NOT NULL,
    ip INET UNIQUE NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS edges (
    userID UUID NOT NULL,
    deviceID UUID NOT NULL,
    PRIMARY KEY (userID, deviceID),
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    FOREIGN KEY (deviceID) REFERENCES devices(deviceID) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION prevent_own_device_edges()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM devices
        WHERE devices.deviceID = NEW.deviceID
        AND devices.userID = NEW.userID
    ) THEN
        RAISE EXCEPTION 'Users cannot create edges with their own devices';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_device_ownership
BEFORE INSERT ON edges
FOR EACH ROW
EXECUTE FUNCTION prevent_own_device_edges();

\c webapp;

CREATE TABLE IF NOT EXISTS users (
    userID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashedPassword VARCHAR(255) UNIQUE NOT NULL
);
