/** Types generated for queries found in "src/db/sql/tunnel_bindings.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertTunnelBinding' parameters type */
export interface IInsertTunnelBindingParams {
  entry_point?: boolean | null | void;
  service_id?: string | null | void;
  slug?: string | null | void;
  ziti_bind_id?: string | null | void;
  ziti_dial_id?: string | null | void;
  ziti_host_id?: string | null | void;
  ziti_intercept_id?: string | null | void;
  ziti_service_id?: string | null | void;
}

/** 'InsertTunnelBinding' return type */
export interface IInsertTunnelBindingResult {
  created: Date;
  entry_point: boolean;
  id: string;
  service_id: string;
  slug: string;
  ziti_bind_id: string;
  ziti_dial_id: string;
  ziti_host_id: string;
  ziti_intercept_id: string;
  ziti_service_id: string;
}

/** 'InsertTunnelBinding' query type */
export interface IInsertTunnelBindingQuery {
  params: IInsertTunnelBindingParams;
  result: IInsertTunnelBindingResult;
}

const insertTunnelBindingIR: any = {"usedParamSet":{"service_id":true,"ziti_host_id":true,"ziti_intercept_id":true,"ziti_dial_id":true,"ziti_bind_id":true,"ziti_service_id":true,"entry_point":true,"slug":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":185,"b":195}]},{"name":"ziti_host_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":202,"b":214}]},{"name":"ziti_intercept_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":221,"b":238}]},{"name":"ziti_dial_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":245,"b":257}]},{"name":"ziti_bind_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":264,"b":276}]},{"name":"ziti_service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":283,"b":298}]},{"name":"entry_point","required":false,"transform":{"type":"scalar"},"locs":[{"a":305,"b":316}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":323,"b":327}]}],"statement":"INSERT INTO tunnel_bindings (\n    service_id,\n    ziti_host_id,\n    ziti_intercept_id,\n    ziti_dial_id,\n    ziti_bind_id,\n    ziti_service_id,\n    entry_point,\n    slug\n) VALUES (\n    :service_id,\n    :ziti_host_id,\n    :ziti_intercept_id,\n    :ziti_dial_id,\n    :ziti_bind_id,\n    :ziti_service_id,\n    :entry_point,\n    :slug\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO tunnel_bindings (
 *     service_id,
 *     ziti_host_id,
 *     ziti_intercept_id,
 *     ziti_dial_id,
 *     ziti_bind_id,
 *     ziti_service_id,
 *     entry_point,
 *     slug
 * ) VALUES (
 *     :service_id,
 *     :ziti_host_id,
 *     :ziti_intercept_id,
 *     :ziti_dial_id,
 *     :ziti_bind_id,
 *     :ziti_service_id,
 *     :entry_point,
 *     :slug
 * )
 * RETURNING *
 * ```
 */
export const insertTunnelBinding = new PreparedQuery<IInsertTunnelBindingParams,IInsertTunnelBindingResult>(insertTunnelBindingIR);


/** 'SelectTunnelBindingsByServiceId' parameters type */
export interface ISelectTunnelBindingsByServiceIdParams {
  service_id?: string | null | void;
}

/** 'SelectTunnelBindingsByServiceId' return type */
export interface ISelectTunnelBindingsByServiceIdResult {
  created: Date;
  entry_point: boolean;
  id: string;
  service_id: string;
  slug: string;
  ziti_bind_id: string;
  ziti_dial_id: string;
  ziti_host_id: string;
  ziti_intercept_id: string;
  ziti_service_id: string;
}

/** 'SelectTunnelBindingsByServiceId' query type */
export interface ISelectTunnelBindingsByServiceIdQuery {
  params: ISelectTunnelBindingsByServiceIdParams;
  result: ISelectTunnelBindingsByServiceIdResult;
}

const selectTunnelBindingsByServiceIdIR: any = {"usedParamSet":{"service_id":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":49,"b":59}]}],"statement":"SELECT *\nFROM tunnel_bindings\nWHERE service_id = :service_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM tunnel_bindings
 * WHERE service_id = :service_id
 * ```
 */
export const selectTunnelBindingsByServiceId = new PreparedQuery<ISelectTunnelBindingsByServiceIdParams,ISelectTunnelBindingsByServiceIdResult>(selectTunnelBindingsByServiceIdIR);


/** 'DeleteTunnelBindingBySlug' parameters type */
export interface IDeleteTunnelBindingBySlugParams {
  slug?: string | null | void;
}

/** 'DeleteTunnelBindingBySlug' return type */
export interface IDeleteTunnelBindingBySlugResult {
  created: Date;
  entry_point: boolean;
  id: string;
  service_id: string;
  slug: string;
  ziti_bind_id: string;
  ziti_dial_id: string;
  ziti_host_id: string;
  ziti_intercept_id: string;
  ziti_service_id: string;
}

/** 'DeleteTunnelBindingBySlug' query type */
export interface IDeleteTunnelBindingBySlugQuery {
  params: IDeleteTunnelBindingBySlugParams;
  result: IDeleteTunnelBindingBySlugResult;
}

const deleteTunnelBindingBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":41,"b":45}]}],"statement":"DELETE FROM tunnel_bindings\nWHERE slug = :slug\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM tunnel_bindings
 * WHERE slug = :slug
 * RETURNING *
 * ```
 */
export const deleteTunnelBindingBySlug = new PreparedQuery<IDeleteTunnelBindingBySlugParams,IDeleteTunnelBindingBySlugResult>(deleteTunnelBindingBySlugIR);


