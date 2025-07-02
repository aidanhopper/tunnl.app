/** Types generated for queries found in "src/db/sql/share_links.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

/** 'CreateShareLinkByServiceId' parameters type */
export interface ICreateShareLinkByServiceIdParams {
  expires?: DateOrString | null | void;
  service_id?: string | null | void;
  slug?: string | null | void;
}

/** 'CreateShareLinkByServiceId' return type */
export interface ICreateShareLinkByServiceIdResult {
  expires: Date;
  id: string;
  slug: string;
  tunnel_binding_id: string;
}

/** 'CreateShareLinkByServiceId' query type */
export interface ICreateShareLinkByServiceIdQuery {
  params: ICreateShareLinkByServiceIdParams;
  result: ICreateShareLinkByServiceIdResult;
}

const createShareLinkByServiceIdIR: any = {"usedParamSet":{"expires":true,"slug":true,"service_id":true},"params":[{"name":"expires","required":false,"transform":{"type":"scalar"},"locs":[{"a":86,"b":93}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":100,"b":104}]},{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":187,"b":197}]}],"statement":"INSERT INTO share_links (\n    expires,\n    slug,\n    tunnel_binding_id\n) VALUES (\n    :expires,\n    :slug,\n    (\n        SELECT id\n        FROM tunnel_bindings\n        WHERE service_id = :service_id\n        LIMIT 1\n    )\n) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO share_links (
 *     expires,
 *     slug,
 *     tunnel_binding_id
 * ) VALUES (
 *     :expires,
 *     :slug,
 *     (
 *         SELECT id
 *         FROM tunnel_bindings
 *         WHERE service_id = :service_id
 *         LIMIT 1
 *     )
 * ) RETURNING *
 * ```
 */
export const createShareLinkByServiceId = new PreparedQuery<ICreateShareLinkByServiceIdParams,ICreateShareLinkByServiceIdResult>(createShareLinkByServiceIdIR);


/** 'GetShareLinkBySlug' parameters type */
export interface IGetShareLinkBySlugParams {
  slug?: string | null | void;
}

/** 'GetShareLinkBySlug' return type */
export interface IGetShareLinkBySlugResult {
  expires: Date;
  id: string;
  slug: string;
  tunnel_binding_id: string;
}

/** 'GetShareLinkBySlug' query type */
export interface IGetShareLinkBySlugQuery {
  params: IGetShareLinkBySlugParams;
  result: IGetShareLinkBySlugResult;
}

const getShareLinkBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":39,"b":43}]}],"statement":"SELECT *\nFROM share_links\nWHERE slug = :slug"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM share_links
 * WHERE slug = :slug
 * ```
 */
export const getShareLinkBySlug = new PreparedQuery<IGetShareLinkBySlugParams,IGetShareLinkBySlugResult>(getShareLinkBySlugIR);


