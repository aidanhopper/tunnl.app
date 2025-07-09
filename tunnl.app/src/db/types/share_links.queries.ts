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


/** 'GetShareLinkOwnerEmail' parameters type */
export interface IGetShareLinkOwnerEmailParams {
  slug?: string | null | void;
}

/** 'GetShareLinkOwnerEmail' return type */
export interface IGetShareLinkOwnerEmailResult {
  email: string;
}

/** 'GetShareLinkOwnerEmail' query type */
export interface IGetShareLinkOwnerEmailQuery {
  params: IGetShareLinkOwnerEmailParams;
  result: IGetShareLinkOwnerEmailResult;
}

const getShareLinkOwnerEmailIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":258,"b":262}]}],"statement":"SELECT email\nFROM users\nWHERE id = (\n    SELECT user_id\n    FROM services\n    WHERE id = (\n        SELECT service_id\n        FROM tunnel_bindings\n        WHERE id = (\n            SELECT tunnel_binding_id\n            FROM share_links\n            WHERE slug = :slug\n        )\n    )\n)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT email
 * FROM users
 * WHERE id = (
 *     SELECT user_id
 *     FROM services
 *     WHERE id = (
 *         SELECT service_id
 *         FROM tunnel_bindings
 *         WHERE id = (
 *             SELECT tunnel_binding_id
 *             FROM share_links
 *             WHERE slug = :slug
 *         )
 *     )
 * )
 * ```
 */
export const getShareLinkOwnerEmail = new PreparedQuery<IGetShareLinkOwnerEmailParams,IGetShareLinkOwnerEmailResult>(getShareLinkOwnerEmailIR);


/** 'DeleteShareLink' parameters type */
export interface IDeleteShareLinkParams {
  id?: string | null | void;
}

/** 'DeleteShareLink' return type */
export type IDeleteShareLinkResult = void;

/** 'DeleteShareLink' query type */
export interface IDeleteShareLinkQuery {
  params: IDeleteShareLinkParams;
  result: IDeleteShareLinkResult;
}

const deleteShareLinkIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":35,"b":37}]}],"statement":"DELETE FROM share_links\nWHERE id = :id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM share_links
 * WHERE id = :id
 * ```
 */
export const deleteShareLink = new PreparedQuery<IDeleteShareLinkParams,IDeleteShareLinkResult>(deleteShareLinkIR);


/** 'GetServiceShareLinks' parameters type */
export interface IGetServiceShareLinksParams {
  slug?: string | null | void;
}

/** 'GetServiceShareLinks' return type */
export interface IGetServiceShareLinksResult {
  expires: Date;
  id: string;
  slug: string;
  tunnel_binding_id: string;
}

/** 'GetServiceShareLinks' query type */
export interface IGetServiceShareLinksQuery {
  params: IGetServiceShareLinksParams;
  result: IGetServiceShareLinksResult;
}

const getServiceShareLinksIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":179,"b":183}]}],"statement":"SELECT *\nFROM share_links\nWHERE tunnel_binding_id = (\n    SELECT id\n    FROM tunnel_bindings\n    WHERE service_id = (\n        SELECT id\n        FROM services\n        WHERE slug = :slug\n    ) \n)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM share_links
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
export const getServiceShareLinks = new PreparedQuery<IGetServiceShareLinksParams,IGetServiceShareLinksResult>(getServiceShareLinksIR);


/** 'DeleteAllServicesShareLinks' parameters type */
export interface IDeleteAllServicesShareLinksParams {
  service_id?: string | null | void;
}

/** 'DeleteAllServicesShareLinks' return type */
export type IDeleteAllServicesShareLinksResult = void;

/** 'DeleteAllServicesShareLinks' query type */
export interface IDeleteAllServicesShareLinksQuery {
  params: IDeleteAllServicesShareLinksParams;
  result: IDeleteAllServicesShareLinksResult;
}

const deleteAllServicesShareLinksIR: any = {"usedParamSet":{"service_id":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":114,"b":124}]}],"statement":"DELETE FROM share_links\nWHERE tunnel_binding_id = (\n    SELECT id\n    FROM tunnel_bindings\n    WHERE service_id = :service_id\n)"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM share_links
 * WHERE tunnel_binding_id = (
 *     SELECT id
 *     FROM tunnel_bindings
 *     WHERE service_id = :service_id
 * )
 * ```
 */
export const deleteAllServicesShareLinks = new PreparedQuery<IDeleteAllServicesShareLinksParams,IDeleteAllServicesShareLinksResult>(deleteAllServicesShareLinksIR);


/** 'DeleteShareLinkByIdAndEmail' parameters type */
export interface IDeleteShareLinkByIdAndEmailParams {
  email?: string | null | void;
  share_link_id?: string | null | void;
}

/** 'DeleteShareLinkByIdAndEmail' return type */
export interface IDeleteShareLinkByIdAndEmailResult {
  expires: Date;
  id: string;
  slug: string;
  tunnel_binding_id: string;
}

/** 'DeleteShareLinkByIdAndEmail' query type */
export interface IDeleteShareLinkByIdAndEmailQuery {
  params: IDeleteShareLinkByIdAndEmailParams;
  result: IDeleteShareLinkByIdAndEmailResult;
}

const deleteShareLinkByIdAndEmailIR: any = {"usedParamSet":{"share_link_id":true,"email":true},"params":[{"name":"share_link_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":35,"b":48}]},{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":281,"b":286}]}],"statement":"DELETE FROM share_links\nWHERE id = :share_link_id \nAND tunnel_binding_id IN (\n    SELECT id \n    FROM tunnel_bindings\n    WHERE service_id IN (\n        SELECT id\n        FROM services\n        WHERE user_id = (\n            SELECT id\n            FROM users\n            WHERE email = :email\n        )\n    )\n) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM share_links
 * WHERE id = :share_link_id 
 * AND tunnel_binding_id IN (
 *     SELECT id 
 *     FROM tunnel_bindings
 *     WHERE service_id IN (
 *         SELECT id
 *         FROM services
 *         WHERE user_id = (
 *             SELECT id
 *             FROM users
 *             WHERE email = :email
 *         )
 *     )
 * ) RETURNING *
 * ```
 */
export const deleteShareLinkByIdAndEmail = new PreparedQuery<IDeleteShareLinkByIdAndEmailParams,IDeleteShareLinkByIdAndEmailResult>(deleteShareLinkByIdAndEmailIR);


