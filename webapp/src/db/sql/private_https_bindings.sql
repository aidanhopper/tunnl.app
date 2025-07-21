/* @name insertPrivateHttpsBinding */
INSERT INTO private_https_bindings (
    user_id,
    tunnel_binding_id,
    slug,
    domain
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
    :domain
);


