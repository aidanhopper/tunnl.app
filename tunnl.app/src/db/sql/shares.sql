/* @name insertShareByEmail */
INSERT INTO shares (
    tunnel_binding_id,
    user_id
) VALUES (
    :tunnel_binding_id,
    (
        SELECT id
        FROM users
        WHERE email = :email
    )
);

/* @name getSharesByEmail */
SELECT
    shares.id,
    services.name AS service_name,
    services.protocol AS service_protocol,
    users.email AS owner_email,
    ziti_intercepts.name AS intercept_name,
    ziti_intercepts.port_ranges AS intercept_port_ranges,
    ziti_intercepts.protocol AS intercept_protocol,
    ziti_intercepts.addresses AS intercept_addresses
FROM shares
JOIN tunnel_bindings ON shares.tunnel_binding_id = tunnel_bindings.id
JOIN services ON services.id = tunnel_bindings.service_id
JOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id
JOIN users ON services.user_id = users.id
WHERE shares.user_id = (
    SELECT id
    FROM users
    WHERE email = :email
);

/* @name getSharesByServiceSlug */
SELECT
    shares.id,
    users.email
FROM shares
JOIN users ON shares.user_id = users.id
WHERE tunnel_binding_id = (
    SELECT id
    FROM tunnel_bindings
    WHERE service_id = (
        SELECT id
        FROM services
        WHERE slug = :slug
    )
);

/* @name deleteAllServiceShares */
WITH deleted_shares AS (
    DELETE FROM shares
    WHERE tunnel_binding_id = (
        SELECT id
        FROM tunnel_bindings
        WHERE service_id = :service_id
    ) RETURNING *
)
SELECT
    deleted_shares.*,
    services.slug AS service_slug
FROM deleted_shares
JOIN tunnel_bindings ON deleted_shares.tunnel_binding_id = tunnel_bindings.id
JOIN services ON services.id = tunnel_bindings.service_id;

/* @name getShareServiceSlugs */
SELECT services.slug
FROM shares
JOIN tunnel_bindings on shares.tunnel_binding_id = tunnel_bindings.id
JOIN services on tunnel_bindings.service_id = services.id
WHERE shares.user_id = :user_id;

/* @name deleteShareById */
WITH deleted_share AS (
    DELETE FROM shares
    WHERE id = :id
    RETURNING *
)
SELECT
    deleted_share.id AS share_id,
    deleted_share.user_id AS share_user_id,
    share_user.email AS share_user_email,
    owner_user.id AS owner_user_id,
    owner_user.email AS owner_user_email
FROM deleted_share
JOIN tunnel_bindings ON deleted_share.tunnel_binding_id = tunnel_bindings.id
JOIN services ON tunnel_bindings.service_id = services.id
JOIN users AS owner_user ON services.user_id = owner_user.id
JOIN users AS share_user ON deleted_share.user_id = share_user.id;
