/** Types generated for queries found in "src/db/sql/ziti_policies.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** Query 'InsertZitiPolicy' is invalid, so its result is assigned type 'never'.
 *  */
export type IInsertZitiPolicyResult = never;

/** Query 'InsertZitiPolicy' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IInsertZitiPolicyParams = never;

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


/** Query 'DeleteZitiPolicy' is invalid, so its result is assigned type 'never'.
 *  */
export type IDeleteZitiPolicyResult = never;

/** Query 'DeleteZitiPolicy' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IDeleteZitiPolicyParams = never;

const deleteZitiPolicyIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":37,"b":39}]}],"statement":"DELETE FROM ziti_policies WHERE id = :id RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM ziti_policies WHERE id = :id RETURNING *
 * ```
 */
export const deleteZitiPolicy = new PreparedQuery<IDeleteZitiPolicyParams,IDeleteZitiPolicyResult>(deleteZitiPolicyIR);


