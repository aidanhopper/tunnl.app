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
