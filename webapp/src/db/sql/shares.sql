/* @name insertShare */
WITH inserted_shares AS (
    INSERT INTO shares (
        service_id,
        user_id,
        slug
    ) VALUES (
        :service_id,
        :user_id,
        :slug
    ) RETURNING *
)
SELECT 
    inserted_shares.*,
    grantee.email AS grantee_email,
    granter.email AS granter_email
FROM inserted_shares
JOIN users AS grantee ON inserted_shares.user_id = grantee.id
JOIN services ON services.id = inserted_shares.service_id
JOIN users AS granter ON services.user_id = granter.id;

/* @name selectSharesByUserId */
SELECT 
    shares.*,
    grantee.email AS grantee_email,
    granter.email AS granter_email
FROM shares
JOIN users AS grantee ON shares.user_id = grantee.id
JOIN services ON services.id = shares.service_id
JOIN users AS granter ON services.user_id = granter.id
WHERE shares.user_id = :user_id;

/* @name selectShareBySlug */
SELECT 
    shares.*,
    grantee.email AS grantee_email,
    granter.email AS granter_email
FROM shares
JOIN users AS grantee ON shares.user_id = grantee.id
JOIN services ON services.id = shares.service_id
JOIN users AS granter ON services.user_id = granter.id
WHERE shares.slug = :slug;

/* @name selectSharesByServiceId */
SELECT 
    shares.*,
    grantee.email AS grantee_email,
    granter.email AS granter_email
FROM shares
JOIN users AS grantee ON shares.user_id = grantee.id
JOIN services ON services.id = shares.service_id
JOIN users AS granter ON services.user_id = granter.id
WHERE service_id = :service_id;

/* @name deleteSharesByServiceIdButNotOwner */
DELETE FROM shares
WHERE service_id = :service_id AND user_id != :owner_user_id
RETURNING *;

/* @name deleteShareBySlug */
DELETE FROM shares
WHERE slug = :slug
RETURNING *;

