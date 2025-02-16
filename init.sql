CREATE TABLE IF NOT EXISTS UserTable (
    userID SERIAL NOT NULL,
    userEmail VARCHAR(255) NOT NULL,
    userPasswordHash TEXT,
    userSubnet VARCHAR(64),
    PRIMARY KEY (userID)
);
