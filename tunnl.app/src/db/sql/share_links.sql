/* @name createShareLinkByServiceId */
INSERT INTO share_links (
    expires,
    slug,
    tunnel_binding_id
) VALUES (
    :expires,
    :slug,
    (
        SELECT id
        FROM tunnel_bindings
        WHERE service_id = :service_id
        LIMIT 1
    )
) RETURNING *;

/* @name getShareLinkBySlug */
SELECT *
FROM share_links
WHERE slug = :slug;

/* @name getShareLinkOwnerEmail */
SELECT email
FROM users
WHERE id = (
    SELECT user_id
    FROM services
    WHERE id = (
        SELECT service_id
        FROM tunnel_bindings
        WHERE id = (
            SELECT tunnel_binding_id
            FROM share_links
            WHERE slug = :slug
        )
    )
);

/* @name deleteShareLink */
DELETE FROM share_links
WHERE id = :id;
