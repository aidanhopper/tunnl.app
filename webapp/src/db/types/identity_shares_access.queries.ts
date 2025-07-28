/** Types generated for queries found in "src/db/sql/identity_shares_access.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertIdentitySharesAccessBySlugs' parameters type */
export interface IInsertIdentitySharesAccessBySlugsParams {
  identity_slug?: string | null | void;
  share_slug?: string | null | void;
}

/** 'InsertIdentitySharesAccessBySlugs' return type */
export interface IInsertIdentitySharesAccessBySlugsResult {
  id: string;
  identity_id: string;
  share_id: string;
}

/** 'InsertIdentitySharesAccessBySlugs' query type */
export interface IInsertIdentitySharesAccessBySlugsQuery {
  params: IInsertIdentitySharesAccessBySlugsParams;
  result: IInsertIdentitySharesAccessBySlugsResult;
}

const insertIdentitySharesAccessBySlugsIR: any = {"usedParamSet":{"identity_slug":true,"share_slug":true},"params":[{"name":"identity_slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":147,"b":160}]},{"name":"share_slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":250,"b":260}]}],"statement":"INSERT INTO identity_shares_access (\n    identity_id,\n    share_id\n) VALUES (\n    (\n        SELECT id\n        FROM identities\n        WHERE slug = :identity_slug\n        LIMIT 1\n    ),\n    (\n        SELECT id\n        FROM shares\n        WHERE slug = :share_slug\n        LIMIT 1\n    )\n) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO identity_shares_access (
 *     identity_id,
 *     share_id
 * ) VALUES (
 *     (
 *         SELECT id
 *         FROM identities
 *         WHERE slug = :identity_slug
 *         LIMIT 1
 *     ),
 *     (
 *         SELECT id
 *         FROM shares
 *         WHERE slug = :share_slug
 *         LIMIT 1
 *     )
 * ) RETURNING *
 * ```
 */
export const insertIdentitySharesAccessBySlugs = new PreparedQuery<IInsertIdentitySharesAccessBySlugsParams,IInsertIdentitySharesAccessBySlugsResult>(insertIdentitySharesAccessBySlugsIR);


/** 'DeleteIdentitySharesAccessBySlugs' parameters type */
export interface IDeleteIdentitySharesAccessBySlugsParams {
  identity_slug?: string | null | void;
  share_slug?: string | null | void;
}

/** 'DeleteIdentitySharesAccessBySlugs' return type */
export interface IDeleteIdentitySharesAccessBySlugsResult {
  id: string;
  identity_id: string;
  share_id: string;
}

/** 'DeleteIdentitySharesAccessBySlugs' query type */
export interface IDeleteIdentitySharesAccessBySlugsQuery {
  params: IDeleteIdentitySharesAccessBySlugsParams;
  result: IDeleteIdentitySharesAccessBySlugsResult;
}

const deleteIdentitySharesAccessBySlugsIR: any = {"usedParamSet":{"identity_slug":true,"share_slug":true},"params":[{"name":"identity_slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":108,"b":121}]},{"name":"share_slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":189,"b":199}]}],"statement":"DELETE FROM identity_shares_access\nWHERE identity_id = (\n    SELECT id\n    FROM identities\n    WHERE slug = :identity_slug\n) AND share_id = (\n    SELECT id\n    FROM shares\n    WHERE slug = :share_slug\n) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM identity_shares_access
 * WHERE identity_id = (
 *     SELECT id
 *     FROM identities
 *     WHERE slug = :identity_slug
 * ) AND share_id = (
 *     SELECT id
 *     FROM shares
 *     WHERE slug = :share_slug
 * ) RETURNING *
 * ```
 */
export const deleteIdentitySharesAccessBySlugs = new PreparedQuery<IDeleteIdentitySharesAccessBySlugsParams,IDeleteIdentitySharesAccessBySlugsResult>(deleteIdentitySharesAccessBySlugsIR);


/** 'SelectIdentitySharesAccessByIdentitySlug' parameters type */
export interface ISelectIdentitySharesAccessByIdentitySlugParams {
  identity_slug?: string | null | void;
}

/** 'SelectIdentitySharesAccessByIdentitySlug' return type */
export interface ISelectIdentitySharesAccessByIdentitySlugResult {
  id: string;
  identity_id: string;
  share_id: string;
}

/** 'SelectIdentitySharesAccessByIdentitySlug' query type */
export interface ISelectIdentitySharesAccessByIdentitySlugQuery {
  params: ISelectIdentitySharesAccessByIdentitySlugParams;
  result: ISelectIdentitySharesAccessByIdentitySlugResult;
}

const selectIdentitySharesAccessByIdentitySlugIR: any = {"usedParamSet":{"identity_slug":true},"params":[{"name":"identity_slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":110,"b":123}]}],"statement":"SELECT *\nFROM identity_shares_access\nWHERE identity_id = (\n    SELECT id\n    FROM identities\n    WHERE slug = :identity_slug\n)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM identity_shares_access
 * WHERE identity_id = (
 *     SELECT id
 *     FROM identities
 *     WHERE slug = :identity_slug
 * )
 * ```
 */
export const selectIdentitySharesAccessByIdentitySlug = new PreparedQuery<ISelectIdentitySharesAccessByIdentitySlugParams,ISelectIdentitySharesAccessByIdentitySlugResult>(selectIdentitySharesAccessByIdentitySlugIR);


/** 'SelectIdentitySharesAccessByShareSlug' parameters type */
export interface ISelectIdentitySharesAccessByShareSlugParams {
  share_slug?: string | null | void;
}

/** 'SelectIdentitySharesAccessByShareSlug' return type */
export interface ISelectIdentitySharesAccessByShareSlugResult {
  id: string;
  identity_id: string;
  share_id: string;
}

/** 'SelectIdentitySharesAccessByShareSlug' query type */
export interface ISelectIdentitySharesAccessByShareSlugQuery {
  params: ISelectIdentitySharesAccessByShareSlugParams;
  result: ISelectIdentitySharesAccessByShareSlugResult;
}

const selectIdentitySharesAccessByShareSlugIR: any = {"usedParamSet":{"share_slug":true},"params":[{"name":"share_slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":103,"b":113}]}],"statement":"SELECT *\nFROM identity_shares_access\nWHERE share_id = (\n    SELECT id\n    FROM shares\n    WHERE slug = :share_slug\n)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM identity_shares_access
 * WHERE share_id = (
 *     SELECT id
 *     FROM shares
 *     WHERE slug = :share_slug
 * )
 * ```
 */
export const selectIdentitySharesAccessByShareSlug = new PreparedQuery<ISelectIdentitySharesAccessByShareSlugParams,ISelectIdentitySharesAccessByShareSlugResult>(selectIdentitySharesAccessByShareSlugIR);


/** 'SelectIdentitySharesAccessByUserId' parameters type */
export interface ISelectIdentitySharesAccessByUserIdParams {
  user_id?: string | null | void;
}

/** 'SelectIdentitySharesAccessByUserId' return type */
export interface ISelectIdentitySharesAccessByUserIdResult {
  id: string;
  identity_id: string;
  identity_ziti_id: string;
  share_id: string;
  share_slug: string;
}

/** 'SelectIdentitySharesAccessByUserId' query type */
export interface ISelectIdentitySharesAccessByUserIdQuery {
  params: ISelectIdentitySharesAccessByUserIdParams;
  result: ISelectIdentitySharesAccessByUserIdResult;
}

const selectIdentitySharesAccessByUserIdIR: any = {"usedParamSet":{"user_id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":242,"b":249}]}],"statement":"SELECT\n    isa.*,\n    shares.slug AS share_slug,\n    identities.ziti_id AS identity_ziti_id\nFROM identity_shares_access isa\nJOIN identities ON identities.id = isa.identity_id\nJOIN shares ON shares.id = isa.share_id\nWHERE identities.user_id = :user_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     isa.*,
 *     shares.slug AS share_slug,
 *     identities.ziti_id AS identity_ziti_id
 * FROM identity_shares_access isa
 * JOIN identities ON identities.id = isa.identity_id
 * JOIN shares ON shares.id = isa.share_id
 * WHERE identities.user_id = :user_id
 * ```
 */
export const selectIdentitySharesAccessByUserId = new PreparedQuery<ISelectIdentitySharesAccessByUserIdParams,ISelectIdentitySharesAccessByUserIdResult>(selectIdentitySharesAccessByUserIdIR);


/** 'SelectIdentitySharesAccessByServiceId' parameters type */
export interface ISelectIdentitySharesAccessByServiceIdParams {
  service_id?: string | null | void;
}

/** 'SelectIdentitySharesAccessByServiceId' return type */
export interface ISelectIdentitySharesAccessByServiceIdResult {
  id: string;
  identity_id: string;
  identity_ziti_id: string;
  share_id: string;
  share_slug: string;
}

/** 'SelectIdentitySharesAccessByServiceId' query type */
export interface ISelectIdentitySharesAccessByServiceIdQuery {
  params: ISelectIdentitySharesAccessByServiceIdParams;
  result: ISelectIdentitySharesAccessByServiceIdResult;
}

const selectIdentitySharesAccessByServiceIdIR: any = {"usedParamSet":{"service_id":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":241,"b":251}]}],"statement":"SELECT\n    isa.*,\n    shares.slug AS share_slug,\n    identities.ziti_id AS identity_ziti_id\nFROM identity_shares_access isa\nJOIN identities ON identities.id = isa.identity_id\nJOIN shares ON shares.id = isa.share_id\nWHERE shares.service_id = :service_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     isa.*,
 *     shares.slug AS share_slug,
 *     identities.ziti_id AS identity_ziti_id
 * FROM identity_shares_access isa
 * JOIN identities ON identities.id = isa.identity_id
 * JOIN shares ON shares.id = isa.share_id
 * WHERE shares.service_id = :service_id
 * ```
 */
export const selectIdentitySharesAccessByServiceId = new PreparedQuery<ISelectIdentitySharesAccessByServiceIdParams,ISelectIdentitySharesAccessByServiceIdResult>(selectIdentitySharesAccessByServiceIdIR);


