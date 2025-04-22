/* @name insertIdentity */
INSERT INTO identities (
    user_id,
    name,
    slug 
) VALUES (
    :user_id,
    :name,
    :slug
);

/* @name insertIdentityByEmail */
INSERT INTO identities (
    user_id,
    name,
    slug
) VALUES (
    (SELECT id FROM users WHERE email = :email),
    :name,
    :slug
);

/* @name getIdentityById */
SELECT * FROM identities WHERE id = :id;

/* @name getIdentitiesByEmail */
SELECT * 
FROM identities 
WHERE user_id = (
    SELECT id
    FROM users
    WHERE email = :email
);

/* @name getIdentityByNameAndEmail */
SELECT * 
FROM identities 
WHERE user_id = (
    SELECT id
    FROM users
    WHERE email = :email
) AND name = :name;

/* @name deleteIdentityByEmail */
DELETE FROM identities
WHERE user_id = (
    SELECT id
    FROM users
    WHERE email = :email
) AND name = :name;

/* @name getIdentityBySlug */
SELECT * 
FROM identities 
WHERE slug = :slug
LIMIT 1;

/* @
