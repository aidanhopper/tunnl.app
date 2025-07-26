/** Types generated for queries found in "src/db/sql/share_links.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

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
  service_id: string;
  slug: string;
}

/** 'InsertShareLink' query type */
export interface IInsertShareLinkQuery {
  params: IInsertShareLinkParams;
  result: IInsertShareLinkResult;
}

const insertShareLinkIR: any = {"usedParamSet":{"expires":true,"slug":true,"service_id":true,"one_time_use":true},"params":[{"name":"expires","required":false,"transform":{"type":"scalar"},"locs":[{"a":97,"b":104}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":111,"b":115}]},{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":122,"b":132}]},{"name":"one_time_use","required":false,"transform":{"type":"scalar"},"locs":[{"a":139,"b":151}]}],"statement":"INSERT INTO share_links (\n    expires,\n    slug,\n    service_id,\n    one_time_use\n) VALUES (\n    :expires,\n    :slug,\n    :service_id,\n    :one_time_use\n) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO share_links (
 *     expires,
 *     slug,
 *     service_id,
 *     one_time_use
 * ) VALUES (
 *     :expires,
 *     :slug,
 *     :service_id,
 *     :one_time_use
 * ) RETURNING *
 * ```
 */
export const insertShareLink = new PreparedQuery<IInsertShareLinkParams,IInsertShareLinkResult>(insertShareLinkIR);


