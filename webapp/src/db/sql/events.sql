/* @name selectZitiServiceDialsByZitiServiceId */
SELECT *
FROM events
WHERE event_type = 'ziti.service.service.dial.success'
    AND data->>'service_id' = :ziti_service_id
    AND created_at >= NOW() - (:interval)::interval
ORDER BY created_at DESC;

/* @name selectZitiCircuitsByZitiServiceId */
SELECT *
FROM events
WHERE event_type LIKE 'ziti.circuit%'
    AND data->>'service_id' = :ziti_service_id
    AND created_at >= NOW() - (:interval)::interval
ORDER BY created_at DESC;

/* @name selectZitiCircuitCreatedEventsByZitiServiceId */
SELECT *
FROM events
WHERE event_type = 'ziti.circuit.created'
    AND data->>'service_id' = :ziti_service_id
    AND created_at >= NOW() - (:interval)::interval
ORDER BY created_at DESC;
