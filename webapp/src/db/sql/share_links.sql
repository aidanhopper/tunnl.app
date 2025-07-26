/* @name insertShareLink */
INSERT INTO share_links (
    expires,
    slug,
    service_id,
    one_time_use
) VALUES (
    :expires,
    :slug,
    :service_id,
    :one_time_use
) RETURNING *;
