/** Types generated for queries found in "src/db/sql/tunnel_bindings.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertTunnelBinding' parameters type */
export interface IInsertTunnelBindingParams {
  bind_policy_id?: string | null | void;
  dial_policy_id?: string | null | void;
  host_id?: string | null | void;
  intercept_id?: string | null | void;
  service_id?: string | null | void;
  share_automatically?: boolean | null | void;
}

/** 'InsertTunnelBinding' return type */
export interface IInsertTunnelBindingResult {
  bind_policy_id: string;
  dial_policy_id: string;
  host_id: string;
  id: string;
  intercept_id: string;
  service_id: string;
  share_automatically: boolean;
}

/** 'InsertTunnelBinding' query type */
export interface IInsertTunnelBindingQuery {
  params: IInsertTunnelBindingParams;
  result: IInsertTunnelBindingResult;
}

const insertTunnelBindingIR: any = {"usedParamSet":{"service_id":true,"host_id":true,"intercept_id":true,"dial_policy_id":true,"bind_policy_id":true,"share_automatically":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":144,"b":154}]},{"name":"host_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":159,"b":166}]},{"name":"intercept_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":171,"b":183}]},{"name":"dial_policy_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":188,"b":202}]},{"name":"bind_policy_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":207,"b":221}]},{"name":"share_automatically","required":false,"transform":{"type":"scalar"},"locs":[{"a":226,"b":245}]}],"statement":"INSERT INTO tunnel_bindings (\n  service_id,\n  host_id,\n  intercept_id,\n  dial_policy_id,\n  bind_policy_id,\n  share_automatically  \n) VALUES (\n  :service_id,\n  :host_id,\n  :intercept_id,\n  :dial_policy_id,\n  :bind_policy_id,\n  :share_automatically\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO tunnel_bindings (
 *   service_id,
 *   host_id,
 *   intercept_id,
 *   dial_policy_id,
 *   bind_policy_id,
 *   share_automatically  
 * ) VALUES (
 *   :service_id,
 *   :host_id,
 *   :intercept_id,
 *   :dial_policy_id,
 *   :bind_policy_id,
 *   :share_automatically
 * )
 * RETURNING *
 * ```
 */
export const insertTunnelBinding = new PreparedQuery<IInsertTunnelBindingParams,IInsertTunnelBindingResult>(insertTunnelBindingIR);


