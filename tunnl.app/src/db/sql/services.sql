/* @name getServicesByEmail */
SELECT *
FROM services
WHERE user_id = (
    SELECT user_id
    FROM users
    WHERE email = :email
)
ORDER BY created DESC;
