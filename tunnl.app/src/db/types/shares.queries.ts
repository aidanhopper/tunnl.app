/** Types generated for queries found in "src/db/sql/shares.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type protocol = 'http' | 'tcp' | 'tcp/udp' | 'udp';

export type stringArray = (string)[];

/** 'InsertShareByEmail' parameters type */
export interface IInsertShareByEmailParams {
  email?: string | null | void;
  tunnel_binding_id?: string | null | void;
}

/** 'InsertShareByEmail' return type */
export type IInsertShareByEmailResult = void;

/** 'InsertShareByEmail' query type */
export interface IInsertShareByEmailQuery {
  params: IInsertShareByEmailParams;
  result: IInsertShareByEmailResult;
}

const insertShareByEmailIR: any = {"usedParamSet":{"tunnel_binding_id":true,"email":true},"params":[{"name":"tunnel_binding_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":71,"b":88}]},{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":156,"b":161}]}],"statement":"INSERT INTO shares (\n    tunnel_binding_id,\n    user_id\n) VALUES (\n    :tunnel_binding_id,\n    (\n        SELECT id\n        FROM users\n        WHERE email = :email\n    )\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO shares (
 *     tunnel_binding_id,
 *     user_id
 * ) VALUES (
 *     :tunnel_binding_id,
 *     (
 *         SELECT id
 *         FROM users
 *         WHERE email = :email
 *     )
 * )
 * ```
 */
export const insertShareByEmail = new PreparedQuery<IInsertShareByEmailParams,IInsertShareByEmailResult>(insertShareByEmailIR);


/** 'GetSharesByEmail' parameters type */
export interface IGetSharesByEmailParams {
  email?: string | null | void;
}

/** 'GetSharesByEmail' return type */
export interface IGetSharesByEmailResult {
  id: string;
  intercept_addresses: stringArray;
  intercept_name: string;
  intercept_port_ranges: string;
  intercept_protocol: protocol;
  owner_email: string;
  service_name: string;
  service_protocol: protocol;
}

/** 'GetSharesByEmail' query type */
export interface IGetSharesByEmailQuery {
  params: IGetSharesByEmailParams;
  result: IGetSharesByEmailResult;
}

const getSharesByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":667,"b":672}]}],"statement":"SELECT\n    shares.id,\n    services.name AS service_name,\n    services.protocol AS service_protocol,\n    users.email AS owner_email,\n    ziti_intercepts.name AS intercept_name,\n    ziti_intercepts.port_ranges AS intercept_port_ranges,\n    ziti_intercepts.protocol AS intercept_protocol,\n    ziti_intercepts.addresses AS intercept_addresses\nFROM shares\nJOIN tunnel_bindings ON shares.tunnel_binding_id = tunnel_bindings.id\nJOIN services ON services.id = tunnel_bindings.service_id\nJOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id\nJOIN users ON services.user_id = users.id\nWHERE shares.user_id = (\n    SELECT id\n    FROM users\n    WHERE email = :email\n)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     shares.id,
 *     services.name AS service_name,
 *     services.protocol AS service_protocol,
 *     users.email AS owner_email,
 *     ziti_intercepts.name AS intercept_name,
 *     ziti_intercepts.port_ranges AS intercept_port_ranges,
 *     ziti_intercepts.protocol AS intercept_protocol,
 *     ziti_intercepts.addresses AS intercept_addresses
 * FROM shares
 * JOIN tunnel_bindings ON shares.tunnel_binding_id = tunnel_bindings.id
 * JOIN services ON services.id = tunnel_bindings.service_id
 * JOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id
 * JOIN users ON services.user_id = users.id
 * WHERE shares.user_id = (
 *     SELECT id
 *     FROM users
 *     WHERE email = :email
 * )
 * ```
 */
export const getSharesByEmail = new PreparedQuery<IGetSharesByEmailParams,IGetSharesByEmailResult>(getSharesByEmailIR);


/** 'GetSharesByServiceSlug' parameters type */
export interface IGetSharesByServiceSlugParams {
  slug?: string | null | void;
}

/** 'GetSharesByServiceSlug' return type */
export interface IGetSharesByServiceSlugResult {
  email: string;
  id: string;
}

/** 'GetSharesByServiceSlug' query type */
export interface IGetSharesByServiceSlugQuery {
  params: IGetSharesByServiceSlugParams;
  result: IGetSharesByServiceSlugResult;
}

const getSharesByServiceSlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":243,"b":247}]}],"statement":"SELECT\n    shares.id,\n    users.email\nFROM shares\nJOIN users ON shares.user_id = users.id\nWHERE tunnel_binding_id = (\n    SELECT id\n    FROM tunnel_bindings\n    WHERE service_id = (\n        SELECT id\n        FROM services\n        WHERE slug = :slug\n    )\n)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     shares.id,
 *     users.email
 * FROM shares
 * JOIN users ON shares.user_id = users.id
 * WHERE tunnel_binding_id = (
 *     SELECT id
 *     FROM tunnel_bindings
 *     WHERE service_id = (
 *         SELECT id
 *         FROM services
 *         WHERE slug = :slug
 *     )
 * )
 * ```
 */
export const getSharesByServiceSlug = new PreparedQuery<IGetSharesByServiceSlugParams,IGetSharesByServiceSlugResult>(getSharesByServiceSlugIR);


/** 'DeleteAllServiceShares' parameters type */
export interface IDeleteAllServiceSharesParams {
  service_id?: string | null | void;
}

/** 'DeleteAllServiceShares' return type */
export interface IDeleteAllServiceSharesResult {
  id: string;
  service_slug: string;
  tunnel_binding_id: string;
  user_id: string;
}

/** 'DeleteAllServiceShares' query type */
export interface IDeleteAllServiceSharesQuery {
  params: IDeleteAllServiceSharesParams;
  result: IDeleteAllServiceSharesResult;
}

const deleteAllServiceSharesIR: any = {"usedParamSet":{"service_id":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":154,"b":164}]}],"statement":"WITH deleted_shares AS (\n    DELETE FROM shares\n    WHERE tunnel_binding_id = (\n        SELECT id\n        FROM tunnel_bindings\n        WHERE service_id = :service_id\n    ) RETURNING *\n)\nSELECT\n    deleted_shares.*,\n    services.slug AS service_slug\nFROM deleted_shares\nJOIN tunnel_bindings ON deleted_shares.tunnel_binding_id = tunnel_bindings.id\nJOIN services ON services.id = tunnel_bindings.service_id"};

/**
 * Query generated from SQL:
 * ```
 * WITH deleted_shares AS (
 *     DELETE FROM shares
 *     WHERE tunnel_binding_id = (
 *         SELECT id
 *         FROM tunnel_bindings
 *         WHERE service_id = :service_id
 *     ) RETURNING *
 * )
 * SELECT
 *     deleted_shares.*,
 *     services.slug AS service_slug
 * FROM deleted_shares
 * JOIN tunnel_bindings ON deleted_shares.tunnel_binding_id = tunnel_bindings.id
 * JOIN services ON services.id = tunnel_bindings.service_id
 * ```
 */
export const deleteAllServiceShares = new PreparedQuery<IDeleteAllServiceSharesParams,IDeleteAllServiceSharesResult>(deleteAllServiceSharesIR);


/** 'GetShareServiceSlugs' parameters type */
export interface IGetShareServiceSlugsParams {
  user_id?: string | null | void;
}

/** 'GetShareServiceSlugs' return type */
export interface IGetShareServiceSlugsResult {
  slug: string;
}

/** 'GetShareServiceSlugs' query type */
export interface IGetShareServiceSlugsQuery {
  params: IGetShareServiceSlugsParams;
  result: IGetShareServiceSlugsResult;
}

const getShareServiceSlugsIR: any = {"usedParamSet":{"user_id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":184,"b":191}]}],"statement":"SELECT services.slug\nFROM shares\nJOIN tunnel_bindings on shares.tunnel_binding_id = tunnel_bindings.id\nJOIN services on tunnel_bindings.service_id = services.id\nWHERE shares.user_id = :user_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT services.slug
 * FROM shares
 * JOIN tunnel_bindings on shares.tunnel_binding_id = tunnel_bindings.id
 * JOIN services on tunnel_bindings.service_id = services.id
 * WHERE shares.user_id = :user_id
 * ```
 */
export const getShareServiceSlugs = new PreparedQuery<IGetShareServiceSlugsParams,IGetShareServiceSlugsResult>(getShareServiceSlugsIR);


/** 'DeleteShareById' parameters type */
export interface IDeleteShareByIdParams {
  id?: string | null | void;
}

/** 'DeleteShareById' return type */
export interface IDeleteShareByIdResult {
  owner_user_email: string;
  owner_user_id: string;
  share_id: string;
  share_user_email: string;
  share_user_id: string;
}

/** 'DeleteShareById' query type */
export interface IDeleteShareByIdQuery {
  params: IDeleteShareByIdParams;
  result: IDeleteShareByIdResult;
}

const deleteShareByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":62,"b":64}]}],"statement":"WITH deleted_share AS (\n    DELETE FROM shares\n    WHERE id = :id\n    RETURNING *\n)\nSELECT\n    deleted_share.id AS share_id,\n    deleted_share.user_id AS share_user_id,\n    share_user.email AS share_user_email,\n    owner_user.id AS owner_user_id,\n    owner_user.email AS owner_user_email\nFROM deleted_share\nJOIN tunnel_bindings ON deleted_share.tunnel_binding_id = tunnel_bindings.id\nJOIN services ON tunnel_bindings.service_id = services.id\nJOIN users AS owner_user ON services.user_id = owner_user.id\nJOIN users AS share_user ON deleted_share.user_id = share_user.id"};

/**
 * Query generated from SQL:
 * ```
 * WITH deleted_share AS (
 *     DELETE FROM shares
 *     WHERE id = :id
 *     RETURNING *
 * )
 * SELECT
 *     deleted_share.id AS share_id,
 *     deleted_share.user_id AS share_user_id,
 *     share_user.email AS share_user_email,
 *     owner_user.id AS owner_user_id,
 *     owner_user.email AS owner_user_email
 * FROM deleted_share
 * JOIN tunnel_bindings ON deleted_share.tunnel_binding_id = tunnel_bindings.id
 * JOIN services ON tunnel_bindings.service_id = services.id
 * JOIN users AS owner_user ON services.user_id = owner_user.id
 * JOIN users AS share_user ON deleted_share.user_id = share_user.id
 * ```
 */
export const deleteShareById = new PreparedQuery<IDeleteShareByIdParams,IDeleteShareByIdResult>(deleteShareByIdIR);


