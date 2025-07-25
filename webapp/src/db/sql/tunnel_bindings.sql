/* @name insertTunnelBinding */
INSERT INTO tunnel_bindings (
    service_id,
    ziti_host_id,
    ziti_intercept_id,
    ziti_dial_id,
    ziti_bind_id,
    ziti_service_id,
    entry_point,
    slug
) VALUES (
    :service_id,
    :ziti_host_id,
    :ziti_intercept_id,
    :ziti_dial_id,
    :ziti_bind_id,
    :ziti_service_id,
    :entry_point,
    :slug
)
RETURNING *;

/* @name selectTunnelBindingsByServiceId */
SELECT *
FROM tunnel_bindings
WHERE service_id = :service_id;

/* @name deleteTunnelBindingBySlug */
DELETE FROM tunnel_bindings
WHERE slug = :slug
RETURNING *;
