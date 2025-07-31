/* @name insertService */
INSERT INTO services (
    user_id,
    slug, 
    name,
    protocol 
) VALUES (
    :user_id,
    :slug,
    :name,
    :protocol
) RETURNING *;

/* @name enableServiceBySlug */
UPDATE services
SET enabled = TRUE
WHERE slug = :slug
RETURNING *;

/* @name disableServiceBySlug */
UPDATE services
SET enabled = FALSE
WHERE slug = :slug
RETURNING *;

/* @name selectServicesByUserId */
SELECT *
FROM services
WHERE user_id = :id
ORDER BY created DESC;

/* @name selectServiceBySlug */
SELECT *
FROM services
WHERE slug = :slug;

/* @name deleteServiceBySlug */
DELETE FROM services
WHERE slug = :slug
RETURNING *;

/* @name selectServiceById */
SELECT *
FROM services
WHERE id = :id;
