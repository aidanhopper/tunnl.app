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

/* @name updateZitiIntercept */
UPDATE ziti_intercepts
SET
  ziti_id = :ziti_id,
  port_ranges = :port_ranges,
  protocol = :protocol,
  addresses = :addresses
WHERE id = :id
RETURNING *;
