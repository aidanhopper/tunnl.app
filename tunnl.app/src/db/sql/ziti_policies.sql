/* @name insertZitiPolicy */
INSERT INTO ziti_policies (
  name,
  ziti_id,
  type,
  semantic,
  service_roles,
  identity_roles
) VALUES (
  :name,
  :ziti_id,
  :type,
  :semantic,
  :service_roles,
  :identity_roles
)
RETURNING *;

/* @name deleteZitiPolicy */
DELETE FROM ziti_policies WHERE id = :id RETURNING *;
