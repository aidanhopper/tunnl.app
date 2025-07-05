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

const getSharesByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":675,"b":680}]}],"statement":"SELECT\n    services.name AS service_name,\n    services.protocol AS service_protocol,\n    users.email AS owner_email,\n    ziti_intercepts.name AS intercept_name,\n    ziti_intercepts.port_ranges AS intercept_port_ranges,\n    ziti_intercepts.protocol AS intercept_protocol,\n    ziti_intercepts.addresses AS intercept_addresses\nFROM tunnel_bindings\nJOIN services ON services.id = tunnel_bindings.service_id\nJOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id\nJOIN users ON services.user_id = users.id\nWHERE tunnel_bindings.id IN (\n    SELECT tunnel_binding_id\n    FROM shares\n    WHERE user_id = (\n        SELECT id\n        FROM users\n        WHERE email = :email\n    )\n)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     services.name AS service_name,
 *     services.protocol AS service_protocol,
 *     users.email AS owner_email,
 *     ziti_intercepts.name AS intercept_name,
 *     ziti_intercepts.port_ranges AS intercept_port_ranges,
 *     ziti_intercepts.protocol AS intercept_protocol,
 *     ziti_intercepts.addresses AS intercept_addresses
 * FROM tunnel_bindings
 * JOIN services ON services.id = tunnel_bindings.service_id
 * JOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id
 * JOIN users ON services.user_id = users.id
 * WHERE tunnel_bindings.id IN (
 *     SELECT tunnel_binding_id
 *     FROM shares
 *     WHERE user_id = (
 *         SELECT id
 *         FROM users
 *         WHERE email = :email
 *     )
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


