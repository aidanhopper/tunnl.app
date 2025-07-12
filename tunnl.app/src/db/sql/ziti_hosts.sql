/* @name insertZitiHost */
INSERT INTO ziti_hosts (
    name,
    forward_ports,
    protocol,
    ziti_id,
    address,
    forward_protocol,
    allowed_port_ranges,
    port
) VALUES (
    :name,
    :forward_ports,
    :protocol,
    :ziti_id,
    :address,
    :forward_protocol,
    :allowed_port_ranges,
    :port
)
RETURNING *;

/* @name deleteZitiHost */
DELETE FROM ziti_hosts WHERE id = :id RETURNING *;

/* @name updateZitiHost */
UPDATE ziti_hosts
SET
    forward_ports = :forward_ports,
    protocol = :protocol,
    ziti_id = :ziti_id,
    address = :address,
    forward_protocol = :forward_protocol,
    allowed_port_ranges = :allowed_port_ranges,
    port = :port
WHERE id = :id
RETURNING *;
