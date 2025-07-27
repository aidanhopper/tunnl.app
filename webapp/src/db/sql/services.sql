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

/* @name enableServiceDb */
UPDATE services
SET enabled = TRUE
WHERE id = :service_id;

/* @name disableServiceDb */
UPDATE services
SET enabled = FALSE
WHERE id = :service_id;

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
