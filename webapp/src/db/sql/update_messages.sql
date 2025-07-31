/* @name getLatestUpdateMessage */
SELECT *
FROM update_messages
ORDER BY timestamp DESC
LIMIT 1;

/* @name insertUpdateMessage */
INSERT INTO update_messages (
    content
) VALUES (
    :content
) RETURNING *;
