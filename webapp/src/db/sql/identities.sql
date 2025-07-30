/* @name insertIdentity */
INSERT INTO identities (
    user_id,
    name,
    slug,
    ziti_id
) VALUES (
    :user_id,
    :name,
    :slug,
    :ziti_id
) RETURNING *;

/* @name selectIdentitiesByUserId */
SELECT *
FROM identities
WHERE user_id = :id;

/* @name selectIdentityBySlug */
SELECT *
FROM identities
WHERE slug = :slug;

/* @name deleteIdentityBySlug */
DELETE FROM identities
WHERE slug = :slug
RETURNING *;

/* @name selectUserByZitiIdentityId */
SELECT users.*
FROM identities
JOIN users ON identities.user_id = users.id
WHERE identities.ziti_id = :ziti_identity_id;
