/* @name insertTunnelBinding */
INSERT INTO tunnel_bindings (
  service_id,
  host_id,
  intercept_id,
  dial_policy_id,
  bind_policy_id,
  share_automatically  
) VALUES (
  :service_id,
  :host_id,
  :intercept_id,
  :dial_policy_id,
  :bind_policy_id,
  :share_automatically
)
RETURNING *;

/* @name getTunnelBindingsByServiceSlug */
SELECT 
  tunnel_bindings.*,
  ziti_hosts.id AS host_id,
  ziti_hosts.name AS host_name,
  ziti_hosts.forward_ports AS host_forward_ports,
  ziti_hosts.protocol AS host_protocol,
  ziti_hosts.ziti_id AS host_ziti_id,
  ziti_hosts.address AS host_address,
  ziti_hosts.forward_protocol AS host_forward_protocol,
  ziti_hosts.allowed_port_ranges AS host_allowed_port_ranges,
  ziti_hosts.port AS host_port,

  ziti_intercepts.id AS intercept_id,
  ziti_intercepts.ziti_id AS intercept_ziti_id,
  ziti_intercepts.name AS intercept_name,
  ziti_intercepts.port_ranges AS intercept_port_ranges,
  ziti_intercepts.protocol AS intercept_protocol,
  ziti_intercepts.addresses AS intercept_addresses,

  dial_policy.id AS dial_policy_id_full,
  dial_policy.name AS dial_policy_name,
  dial_policy.ziti_id AS dial_policy_ziti_id,
  dial_policy.type AS dial_policy_type,
  dial_policy.semantic AS dial_policy_semantic,
  dial_policy.service_roles AS dial_policy_service_roles,
  dial_policy.identity_roles AS dial_policy_identity_roles,

  bind_policy.id AS bind_policy_id_full,
  bind_policy.name AS bind_policy_name,
  bind_policy.ziti_id AS bind_policy_ziti_id,
  bind_policy.type AS bind_policy_type,
  bind_policy.semantic AS bind_policy_semantic,
  bind_policy.service_roles AS bind_policy_service_roles,
  bind_policy.identity_roles AS bind_policy_identity_roles

FROM tunnel_bindings
JOIN services ON services.id = tunnel_bindings.service_id
JOIN ziti_hosts ON ziti_hosts.id = tunnel_bindings.host_id
JOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id
JOIN ziti_policies AS dial_policy ON dial_policy.id = tunnel_bindings.dial_policy_id
JOIN ziti_policies AS bind_policy ON bind_policy.id = tunnel_bindings.bind_policy_id
WHERE services.slug = :slug;

/* @name getTunnelBinding */
SELECT 
  tunnel_bindings.*,
  ziti_hosts.id AS host_id,
  ziti_hosts.name AS host_name,
  ziti_hosts.forward_ports AS host_forward_ports,
  ziti_hosts.protocol AS host_protocol,
  ziti_hosts.ziti_id AS host_ziti_id,
  ziti_hosts.address AS host_address,
  ziti_hosts.forward_protocol AS host_forward_protocol,
  ziti_hosts.allowed_port_ranges AS host_allowed_port_ranges,
  ziti_hosts.port AS host_port,

  ziti_intercepts.id AS intercept_id,
  ziti_intercepts.ziti_id AS intercept_ziti_id,
  ziti_intercepts.name AS intercept_name,
  ziti_intercepts.port_ranges AS intercept_port_ranges,
  ziti_intercepts.protocol AS intercept_protocol,
  ziti_intercepts.addresses AS intercept_addresses,

  dial_policy.id AS dial_policy_id,
  dial_policy.name AS dial_policy_name,
  dial_policy.ziti_id AS dial_policy_ziti_id,
  dial_policy.type AS dial_policy_type,
  dial_policy.semantic AS dial_policy_semantic,
  dial_policy.service_roles AS dial_policy_service_roles,
  dial_policy.identity_roles AS dial_policy_identity_roles,

  bind_policy.id AS bind_policy_id,
  bind_policy.name AS bind_policy_name,
  bind_policy.ziti_id AS bind_policy_ziti_id,
  bind_policy.type AS bind_policy_type,
  bind_policy.semantic AS bind_policy_semantic,
  bind_policy.service_roles AS bind_policy_service_roles,
  bind_policy.identity_roles AS bind_policy_identity_roles

FROM tunnel_bindings
JOIN services ON services.id = tunnel_bindings.service_id
JOIN ziti_hosts ON ziti_hosts.id = tunnel_bindings.host_id
JOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id
JOIN ziti_policies AS dial_policy ON dial_policy.id = tunnel_bindings.dial_policy_id
JOIN ziti_policies AS bind_policy ON bind_policy.id = tunnel_bindings.bind_policy_id
WHERE tunnel_bindings.id = :id;

/* @name deleteTunnelBinding */
DELETE FROM tunnel_bindings WHERE id = :id RETURNING *;

/* @name getAutomaticallySharedTunnelBindingSlugsByEmail */
SELECT slug 
FROM services
WHERE id = (
    SELECT id
    FROM services
    WHERE user_id = (
        SELECT id
        FROM users
        WHERE email = :email
    )
) AND id = (
    SELECT service_id
    FROM tunnel_bindings
    WHERE share_automatically = true
);
