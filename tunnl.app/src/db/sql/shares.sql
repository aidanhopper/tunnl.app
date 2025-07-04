/* @name insertShareByEmail */
INSERT INTO shares (
    tunnel_binding_id,
    user_id
) VALUES (
    :tunnel_binding_id,
    (
        SELECT id
        FROM users
        WHERE email = :email
    )
);
