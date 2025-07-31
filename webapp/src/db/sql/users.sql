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

/* @name selectUserByEmail */
SELECT *
FROM users
WHERE email = :email
LIMIT 1;

/* @name selectUserById */
SELECT *
FROM users
WHERE id = :id
LIMIT 1;

/* @name approveUserByEmail */
UPDATE users
SET roles = 'approved'
WHERE email = :email
RETURNING *;

/* @name unapproveUserByEmail */
UPDATE users
SET roles = ''
WHERE email = :email
RETURNING *;
