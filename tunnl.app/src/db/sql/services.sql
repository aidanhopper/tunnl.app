/* @name getServicesByEmail */
SELECT *
FROM services
WHERE user_id = (
    SELECT id
    FROM users
    WHERE email = :email
)
ORDER BY created DESC;

/* @name insertServiceByEmail */
INSERT INTO services (
    user_id,
    slug, 
    name,
    ziti_id,
    protocol 
) VALUES (
    (SELECT id FROM users WHERE email = :email),
    :slug,
    :name,
    :ziti_id,
    :protocol
);

/* @name deleteServiceByNameAndEmail */
DELETE FROM services
WHERE user_id = (
    SELECT id
    FROM users 
    WHERE email = :email
) AND name = :name;

/* @name getServiceBySlug */
SELECT *
FROM services
WHERE slug = :slug;

/* @name getServiceByNameAndEmail */
SELECT *
FROM services
WHERE user_id = (
    SELECT id
    FROM users
    WHERE email = :email
) AND name = :name;

/* @name getUserServiceAndIdentityBySlugs */
SELECT
    users.id AS user_id,
    users.email AS email,
    services.id AS service_id,
    services.ziti_id AS service_ziti_id,
    services.slug AS service_slug,
    identities.id AS identity_id,
    identities.ziti_id AS identity_ziti_id,
    identities.slug AS identity_slug
FROM services
JOIN users ON users.id = services.user_id
LEFT JOIN identities ON identities.user_id = users.id
WHERE services.slug = :service_slug
  AND identities.slug = :identity_slug;

/* @name getService */
SELECT *
FROM services
WHERE id = :id;
