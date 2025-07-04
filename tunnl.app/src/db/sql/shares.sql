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
  services.name AS service_name,
  services.protocol AS service_protocol,
  users.email AS owner_email,
  ziti_intercepts.name AS intercept_name,
  ziti_intercepts.port_ranges AS intercept_port_ranges,
  ziti_intercepts.protocol AS intercept_protocol,
  ziti_intercepts.addresses AS intercept_addresses
FROM tunnel_bindings
JOIN services ON services.id = tunnel_bindings.service_id
JOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id
JOIN users ON services.user_id = users.id
WHERE tunnel_bindings.id IN (
    SELECT tunnel_binding_id
    FROM shares
    WHERE user_id = (
        SELECT id
        FROM users
        WHERE email = :email
    )
);
