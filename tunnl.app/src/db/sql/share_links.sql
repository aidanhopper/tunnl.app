/* @name createShareLinkByServiceId */
INSERT INTO share_links (
    expires,
    slug,
    tunnel_binding_id,
    one_time_use
) VALUES (
    :expires,
    :slug,
    (
        SELECT id
        FROM tunnel_bindings
        WHERE service_id = :service_id
        LIMIT 1
    ),
    :one_time_use
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

/* @name getServiceShareLinks */
SELECT *
FROM share_links
WHERE tunnel_binding_id = (
    SELECT id
    FROM tunnel_bindings
    WHERE service_id = (
        SELECT id
        FROM services
        WHERE slug = :slug
    ) 
);

/* @name deleteAllServicesShareLinks */
DELETE FROM share_links
WHERE tunnel_binding_id = (
    SELECT id
    FROM tunnel_bindings
    WHERE service_id = :service_id
);

/* @name deleteShareLinkByIdAndEmail */
DELETE FROM share_links
WHERE id = :share_link_id 
AND tunnel_binding_id IN (
    SELECT id 
    FROM tunnel_bindings
    WHERE service_id IN (
        SELECT id
        FROM services
        WHERE user_id = (
            SELECT id
            FROM users
            WHERE email = :email
        )
    )
) RETURNING *;
