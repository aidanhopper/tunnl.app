/* @name insertUser */
INSERT INTO users (
    email
) VALUES (
    :email
);

/* @name updateUserLogin */
UPDATE users
SET last_login = NOW()
WHERE email = :email;

/* @name getUserByEmail */
SELECT *
FROM users
WHERE email = :email
LIMIT 1;
