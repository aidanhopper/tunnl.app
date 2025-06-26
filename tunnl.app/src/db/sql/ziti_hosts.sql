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
