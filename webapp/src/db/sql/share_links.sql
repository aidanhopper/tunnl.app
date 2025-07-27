/* @name insertShareLink */
WITH inserted_share_links AS (
    INSERT INTO share_links (
        expires,
        slug,
        service_id,
        one_time_use
    ) VALUES (
        :expires,
        :slug,
        :service_id,
        :one_time_use
    ) RETURNING *
)
SELECT
    inserted_share_links.*,
    users.email AS producer_email
FROM inserted_share_links
JOIN services ON inserted_share_links.service_id = services.id
JOIN users ON services.user_id = users.id;

/* @name deleteShareLinkBySlug */
WITH deleted_share_links AS (
    DELETE FROM share_links
    WHERE share_links.slug = :slug
    RETURNING *
)
SELECT
    *,
    users.id AS service_owner_user_id
FROM deleted_share_links
JOIN services ON services.id = deleted_share_links.service_id
JOIN users ON users.id = services.user_id;

/* @name selectShareLinksByServiceId */
SELECT
    share_links.*,
    users.email AS producer_email
FROM share_links
JOIN services ON share_links.service_id = services.id
JOIN users ON services.user_id = users.id
WHERE service_id = :service_id;

/* @name deleteShareLinksByServiceId */
DELETE FROM share_links
WHERE share_links.service_id = :service_id
RETURNING *;

/* @name selectShareLinkBySlug */
SELECT
    share_links.*,
    users.email AS producer_email
FROM share_links
JOIN services ON share_links.service_id = services.id
JOIN users ON services.user_id = users.id
WHERE share_links.slug = :slug;
