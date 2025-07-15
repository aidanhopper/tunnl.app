/* @name getLatestUpdateMessage */
SELECT *
FROM update_messages
ORDER BY timestamp DESC
LIMIT 1;
