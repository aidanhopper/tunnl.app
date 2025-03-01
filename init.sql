\c postgres;

CREATE DATABASE networks;
CREATE DATABASE app;

\c networks;

CREATE TABLE IF NOT EXISTS users (
    userID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS pendingDevices (
    pendingEnrollmentDeviceID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zitiIdentityID TEXT UNIQUE NOT NULL,
    userID UUID NOT NULL,
    creationTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS devices (
    deviceID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zitiIdentityID TEXT UNIQUE NOT NULL,
    deviceName TEXT NOT NULL,
    userID UUID NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS services (
    serviceID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain TEXT UNIQUE NOT NULL,
    ownerID UUID NOT NULL,
    portRange TEXT NOT NULL,
    dialRole TEXT UNIQUE NOT NULL,
    bindRole TEXT UNIQUE NOT NULL,
    FOREIGN KEY (ownerID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS binds (
    serviceID UUID NOT NULL,
    deviceID TEXT NOT NULL,
    FOREIGN KEY (serviceID) REFERENCES services(serviceID) ON DELETE CASCADE,
    FOREIGN KEY (deviceID) REFERENCES devices(deviceID) ON DELETE CASCADE, 
    PRIMARY KEY (serviceID, deviceID)
);

CREATE TABLE IF NOT EXISTS dials (
    userID UUID NOT NULL,
    serviceID UUID NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE, 
    FOREIGN KEY (serviceID) REFERENCES services(serviceID) ON DELETE CASCADE, 
    PRIMARY KEY (userID, serviceID)
);

CREATE TABLE IF NOT EXISTS apiKeys (
    key TEXT NOT NULL,
    time TIMESTAMP NOT NULL
);

\c app;

CREATE TABLE IF NOT EXISTS users (
    userID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    displayName TEXT,
    accessToken TEXT NOT NULL,
    refreshToken TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS communities (
    communityID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    ownerID UUID UNIQUE NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (ownerID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS members (
    userID UUID NOT NULL,
    communityID UUID NOT NULL,
    FOREIGN KEY (communityID) REFERENCES communities(communityID) ON DELETE CASCADE,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    PRIMARY KEY (userID, communityID)
);

CREATE TABLE IF NOT EXISTS services (
    serviceID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userID UUID NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shares (
    serviceID UUID NOT NULL,
    communityID UUID NOT NULL,
    FOREIGN KEY (communityID) REFERENCES communities(communityID) ON DELETE CASCADE,
    FOREIGN KEY (serviceID) REFERENCES services(serviceID) ON DELETE CASCADE,
    PRIMARY KEY (communityID, serviceID)
);

CREATE TABLE IF NOT EXISTS invites (
    communityID UUID NOT NULL,
    code TEXT NOT NULL,
    FOREIGN KEY (communityID) REFERENCES communities(communityID) ON DELETE CASCADE,
    PRIMARY KEY (communityID, code)
);
