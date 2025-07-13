/* @name getServiceDialsByServiceId */
SELECT *
FROM service_dials
WHERE service_id = :service_id
  AND timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY timestamp ASC;
