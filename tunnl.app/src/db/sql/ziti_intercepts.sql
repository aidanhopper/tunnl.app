/* @name insertZitiIntercept */
INSERT INTO ziti_intercepts (
  ziti_id,
  name,
  port_ranges,
  protocol,
  addresses
) VALUES (
  :ziti_id,
  :name,
  :port_ranges,
  :protocol,
  :addresses
)
RETURNING *;

/* @name deleteZitiIntercept */
DELETE FROM ziti_intercepts WHERE id = :id RETURNING *;
