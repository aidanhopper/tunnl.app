/** Types generated for queries found in "src/db/sql/share_links.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type protocol = 'http' | 'tcp' | 'tcp/udp' | 'udp';

export type DateOrString = Date | string;

/** 'InsertShareLink' parameters type */
export interface IInsertShareLinkParams {
  expires?: DateOrString | null | void;
  one_time_use?: boolean | null | void;
  service_id?: string | null | void;
  slug?: string | null | void;
}

/** 'InsertShareLink' return type */
export interface IInsertShareLinkResult {
  expires: Date;
  id: string;
  one_time_use: boolean;
  producer_email: string;
  service_id: string;
  slug: string;
}

/** 'InsertShareLink' query type */
export interface IInsertShareLinkQuery {
  params: IInsertShareLinkParams;
  result: IInsertShareLinkResult;
}

const insertShareLinkIR: any = {"usedParamSet":{"expires":true,"slug":true,"service_id":true,"one_time_use":true},"params":[{"name":"expires","required":false,"transform":{"type":"scalar"},"locs":[{"a":156,"b":163}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":174,"b":178}]},{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":189,"b":199}]},{"name":"one_time_use","required":false,"transform":{"type":"scalar"},"locs":[{"a":210,"b":222}]}],"statement":"WITH inserted_share_links AS (\n    INSERT INTO share_links (\n        expires,\n        slug,\n        service_id,\n        one_time_use\n    ) VALUES (\n        :expires,\n        :slug,\n        :service_id,\n        :one_time_use\n    ) RETURNING *\n)\nSELECT\n    inserted_share_links.*,\n    users.email AS producer_email\nFROM inserted_share_links\nJOIN services ON inserted_share_links.service_id = services.id\nJOIN users ON services.user_id = users.id"};

/**
 * Query generated from SQL:
 * ```
 * WITH inserted_share_links AS (
 *     INSERT INTO share_links (
 *         expires,
 *         slug,
 *         service_id,
 *         one_time_use
 *     ) VALUES (
 *         :expires,
 *         :slug,
 *         :service_id,
 *         :one_time_use
 *     ) RETURNING *
 * )
 * SELECT
 *     inserted_share_links.*,
 *     users.email AS producer_email
 * FROM inserted_share_links
 * JOIN services ON inserted_share_links.service_id = services.id
 * JOIN users ON services.user_id = users.id
 * ```
 */
export const insertShareLink = new PreparedQuery<IInsertShareLinkParams,IInsertShareLinkResult>(insertShareLinkIR);


/** 'DeleteShareLinkBySlug' parameters type */
export interface IDeleteShareLinkBySlugParams {
  slug?: string | null | void;
}

/** 'DeleteShareLinkBySlug' return type */
export interface IDeleteShareLinkBySlugResult {
  created: Date;
  email: string;
  enabled: boolean;
  expires: Date;
  id: string;
  id: string;
  id: string;
  last_login: Date;
  name: string;
  one_time_use: boolean;
  protocol: protocol;
  roles: string;
  service_id: string;
  service_owner_user_id: string;
  slug: string;
  slug: string;
  user_id: string;
}

/** 'DeleteShareLinkBySlug' query type */
export interface IDeleteShareLinkBySlugQuery {
  params: IDeleteShareLinkBySlugParams;
  result: IDeleteShareLinkBySlugResult;
}

const deleteShareLinkBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":87,"b":91}]}],"statement":"WITH deleted_share_links AS (\n    DELETE FROM share_links\n    WHERE share_links.slug = :slug\n    RETURNING *\n)\nSELECT\n    *,\n    users.id AS service_owner_user_id\nFROM deleted_share_links\nJOIN services ON services.id = deleted_share_links.service_id\nJOIN users ON users.id = services.user_id"};

/**
 * Query generated from SQL:
 * ```
 * WITH deleted_share_links AS (
 *     DELETE FROM share_links
 *     WHERE share_links.slug = :slug
 *     RETURNING *
 * )
 * SELECT
 *     *,
 *     users.id AS service_owner_user_id
 * FROM deleted_share_links
 * JOIN services ON services.id = deleted_share_links.service_id
 * JOIN users ON users.id = services.user_id
 * ```
 */
export const deleteShareLinkBySlug = new PreparedQuery<IDeleteShareLinkBySlugParams,IDeleteShareLinkBySlugResult>(deleteShareLinkBySlugIR);


/** 'SelectShareLinksByServiceId' parameters type */
export interface ISelectShareLinksByServiceIdParams {
  service_id?: string | null | void;
}

/** 'SelectShareLinksByServiceId' return type */
export interface ISelectShareLinksByServiceIdResult {
  expires: Date;
  id: string;
  one_time_use: boolean;
  producer_email: string;
  service_id: string;
  slug: string;
}

/** 'SelectShareLinksByServiceId' query type */
export interface ISelectShareLinksByServiceIdQuery {
  params: ISelectShareLinksByServiceIdParams;
  result: ISelectShareLinksByServiceIdResult;
}

const selectShareLinksByServiceIdIR: any = {"usedParamSet":{"service_id":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":192,"b":202}]}],"statement":"SELECT\n    share_links.*,\n    users.email AS producer_email\nFROM share_links\nJOIN services ON share_links.service_id = services.id\nJOIN users ON services.user_id = users.id\nWHERE service_id = :service_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     share_links.*,
 *     users.email AS producer_email
 * FROM share_links
 * JOIN services ON share_links.service_id = services.id
 * JOIN users ON services.user_id = users.id
 * WHERE service_id = :service_id
 * ```
 */
export const selectShareLinksByServiceId = new PreparedQuery<ISelectShareLinksByServiceIdParams,ISelectShareLinksByServiceIdResult>(selectShareLinksByServiceIdIR);


/** 'DeleteShareLinksByServiceId' parameters type */
export interface IDeleteShareLinksByServiceIdParams {
  service_id?: string | null | void;
}

/** 'DeleteShareLinksByServiceId' return type */
export interface IDeleteShareLinksByServiceIdResult {
  expires: Date;
  id: string;
  one_time_use: boolean;
  service_id: string;
  slug: string;
}

/** 'DeleteShareLinksByServiceId' query type */
export interface IDeleteShareLinksByServiceIdQuery {
  params: IDeleteShareLinksByServiceIdParams;
  result: IDeleteShareLinksByServiceIdResult;
}

const deleteShareLinksByServiceIdIR: any = {"usedParamSet":{"service_id":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":55,"b":65}]}],"statement":"DELETE FROM share_links\nWHERE share_links.service_id = :service_id\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM share_links
 * WHERE share_links.service_id = :service_id
 * RETURNING *
 * ```
 */
export const deleteShareLinksByServiceId = new PreparedQuery<IDeleteShareLinksByServiceIdParams,IDeleteShareLinksByServiceIdResult>(deleteShareLinksByServiceIdIR);


/** 'SelectShareLinkBySlug' parameters type */
export interface ISelectShareLinkBySlugParams {
  slug?: string | null | void;
}

/** 'SelectShareLinkBySlug' return type */
export interface ISelectShareLinkBySlugResult {
  expires: Date;
  id: string;
  one_time_use: boolean;
  producer_email: string;
  service_id: string;
  slug: string;
}

/** 'SelectShareLinkBySlug' query type */
export interface ISelectShareLinkBySlugQuery {
  params: ISelectShareLinkBySlugParams;
  result: ISelectShareLinkBySlugResult;
}

const selectShareLinkBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":198,"b":202}]}],"statement":"SELECT\n    share_links.*,\n    users.email AS producer_email\nFROM share_links\nJOIN services ON share_links.service_id = services.id\nJOIN users ON services.user_id = users.id\nWHERE share_links.slug = :slug"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     share_links.*,
 *     users.email AS producer_email
 * FROM share_links
 * JOIN services ON share_links.service_id = services.id
 * JOIN users ON services.user_id = users.id
 * WHERE share_links.slug = :slug
 * ```
 */
export const selectShareLinkBySlug = new PreparedQuery<ISelectShareLinkBySlugParams,ISelectShareLinkBySlugResult>(selectShareLinkBySlugIR);


