/* @name insertPrivateHttpsBinding */
INSERT INTO private_https_bindings (
    user_id,
    tunnel_binding_id,
    slug,
    domain,
    ziti_service_id,
    ziti_intercept_id,
    ziti_bind_id,
    ziti_dial_id
) VALUES (
    (
        SELECT user_id
        FROM services
        WHERE id = (
            SELECT service_id 
            FROM tunnel_bindings
            WHERE id = :tunnel_binding_id
        )
    ),
    :tunnel_binding_id,
    :slug,
    :domain,
    :ziti_service_id,
    :ziti_intercept_id,
    :ziti_bind_id,
    :ziti_dial_id
);


/* @name getPrivateHttpsBindingsByUser */
SELECT 
    private_https_bindings.*,
    services.slug AS service_slug
FROM private_https_bindings
JOIN tunnel_bindings ON tunnel_bindings.id = private_https_bindings.tunnel_binding_id
JOIN services ON services.id = tunnel_bindings.service_id
WHERE private_https_bindings.user_id = :user_id AND services.enabled = true;

/* @name getPrivateHttpsBinding */
SELECT 
    private_https_bindings.*,
    services.slug AS service_slug,
    users.email
FROM private_https_bindings
JOIN tunnel_bindings ON tunnel_bindings.id = private_https_bindings.tunnel_binding_id
JOIN services ON services.id = tunnel_bindings.service_id
JOIN users ON users.id = services.user_id
WHERE private_https_bindings.id = :id;

/* @name deletePrivateHttpsBindingDb */
DELETE FROM private_https_bindings
WHERE private_https_bindings.id = :id;

/* @name getPrivateHttpsBindingsByTunnelBinding */
SELECT *
FROM private_https_bindings
WHERE tunnel_binding_id = :tunnel_binding_id;
