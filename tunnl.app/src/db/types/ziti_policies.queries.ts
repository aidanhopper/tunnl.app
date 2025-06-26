/** Types generated for queries found in "src/db/sql/ziti_policies.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type policy_semantic = 'AllOf' | 'AnyOf';

export type policy_type = 'Bind' | 'Dial';

export type stringArray = (string)[];

/** 'InsertZitiPolicy' parameters type */
export interface IInsertZitiPolicyParams {
  identity_roles?: stringArray | null | void;
  name?: string | null | void;
  semantic?: policy_semantic | null | void;
  service_roles?: stringArray | null | void;
  type?: policy_type | null | void;
  ziti_id?: string | null | void;
}

/** 'InsertZitiPolicy' return type */
export interface IInsertZitiPolicyResult {
  id: string;
  identity_roles: stringArray;
  name: string;
  semantic: policy_semantic;
  service_roles: stringArray;
  type: policy_type;
  ziti_id: string;
}

/** 'InsertZitiPolicy' query type */
export interface IInsertZitiPolicyQuery {
  params: IInsertZitiPolicyParams;
  result: IInsertZitiPolicyResult;
}

const insertZitiPolicyIR: any = {"usedParamSet":{"name":true,"ziti_id":true,"type":true,"semantic":true,"service_roles":true,"identity_roles":true},"params":[{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":114,"b":118}]},{"name":"ziti_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":123,"b":130}]},{"name":"type","required":false,"transform":{"type":"scalar"},"locs":[{"a":135,"b":139}]},{"name":"semantic","required":false,"transform":{"type":"scalar"},"locs":[{"a":144,"b":152}]},{"name":"service_roles","required":false,"transform":{"type":"scalar"},"locs":[{"a":157,"b":170}]},{"name":"identity_roles","required":false,"transform":{"type":"scalar"},"locs":[{"a":175,"b":189}]}],"statement":"INSERT INTO ziti_policies (\n  name,\n  ziti_id,\n  type,\n  semantic,\n  service_roles,\n  identity_roles\n) VALUES (\n  :name,\n  :ziti_id,\n  :type,\n  :semantic,\n  :service_roles,\n  :identity_roles\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO ziti_policies (
 *   name,
 *   ziti_id,
 *   type,
 *   semantic,
 *   service_roles,
 *   identity_roles
 * ) VALUES (
 *   :name,
 *   :ziti_id,
 *   :type,
 *   :semantic,
 *   :service_roles,
 *   :identity_roles
 * )
 * RETURNING *
 * ```
 */
export const insertZitiPolicy = new PreparedQuery<IInsertZitiPolicyParams,IInsertZitiPolicyResult>(insertZitiPolicyIR);


