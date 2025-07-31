/* @name insertIdentitySharesAccessBySlugs */
INSERT INTO identity_shares_access (
    identity_id,
    share_id
) VALUES (
    (
        SELECT id
        FROM identities
        WHERE slug = :identity_slug
        LIMIT 1
    ),
    (
        SELECT id
        FROM shares
        WHERE slug = :share_slug
        LIMIT 1
    )
) RETURNING *;

/* @name deleteIdentitySharesAccessBySlugs */
DELETE FROM identity_shares_access
WHERE identity_id = (
    SELECT id
    FROM identities
    WHERE slug = :identity_slug
) AND share_id = (
    SELECT id
    FROM shares
    WHERE slug = :share_slug
) RETURNING *;

/* @name selectIdentitySharesAccessByIdentitySlug */
SELECT *
FROM identity_shares_access
WHERE identity_id = (
    SELECT id
    FROM identities
    WHERE slug = :identity_slug
);

/* @name selectIdentitySharesAccessByShareSlug */
SELECT *
FROM identity_shares_access
WHERE share_id = (
    SELECT id
    FROM shares
    WHERE slug = :share_slug
);

/* @name selectIdentitySharesAccessByUserId */
SELECT
    isa.*,
    shares.slug AS share_slug,
    identities.ziti_id AS identity_ziti_id,
    services.enabled,
    grantee.roles AS grantee_roles,
    granter.roles AS granter_roles
FROM identity_shares_access isa
JOIN identities ON identities.id = isa.identity_id
JOIN shares ON shares.id = isa.share_id
JOIN services ON services.id = shares.service_id
JOIN users AS grantee ON shares.user_id = grantee.id
JOIN users AS granter ON services.user_id = granter.id
WHERE identities.user_id = :user_id;

/* @name selectIdentitySharesAccessByServiceId */
SELECT
    isa.*,
    shares.slug AS share_slug,
    identities.ziti_id AS identity_ziti_id,
    services.enabled,
    grantee.roles AS grantee_roles,
    granter.roles AS granter_roles
FROM identity_shares_access isa
JOIN identities ON identities.id = isa.identity_id
JOIN shares ON shares.id = isa.share_id
JOIN services ON services.id = shares.service_id
JOIN users AS grantee ON shares.user_id = grantee.id
JOIN users AS granter ON services.user_id = granter.id
WHERE shares.service_id = :service_id;
