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
