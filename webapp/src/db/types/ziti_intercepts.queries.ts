/** Types generated for queries found in "src/db/sql/ziti_intercepts.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** Query 'InsertZitiIntercept' is invalid, so its result is assigned type 'never'.
 *  */
export type IInsertZitiInterceptResult = never;

/** Query 'InsertZitiIntercept' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IInsertZitiInterceptParams = never;

const insertZitiInterceptIR: any = {"usedParamSet":{"ziti_id":true,"name":true,"port_ranges":true,"protocol":true,"addresses":true},"params":[{"name":"ziti_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":101,"b":108}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":113,"b":117}]},{"name":"port_ranges","required":false,"transform":{"type":"scalar"},"locs":[{"a":122,"b":133}]},{"name":"protocol","required":false,"transform":{"type":"scalar"},"locs":[{"a":138,"b":146}]},{"name":"addresses","required":false,"transform":{"type":"scalar"},"locs":[{"a":151,"b":160}]}],"statement":"INSERT INTO ziti_intercepts (\n  ziti_id,\n  name,\n  port_ranges,\n  protocol,\n  addresses\n) VALUES (\n  :ziti_id,\n  :name,\n  :port_ranges,\n  :protocol,\n  :addresses\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO ziti_intercepts (
 *   ziti_id,
 *   name,
 *   port_ranges,
 *   protocol,
 *   addresses
 * ) VALUES (
 *   :ziti_id,
 *   :name,
 *   :port_ranges,
 *   :protocol,
 *   :addresses
 * )
 * RETURNING *
 * ```
 */
export const insertZitiIntercept = new PreparedQuery<IInsertZitiInterceptParams,IInsertZitiInterceptResult>(insertZitiInterceptIR);


/** Query 'DeleteZitiIntercept' is invalid, so its result is assigned type 'never'.
 *  */
export type IDeleteZitiInterceptResult = never;

/** Query 'DeleteZitiIntercept' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IDeleteZitiInterceptParams = never;

const deleteZitiInterceptIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":39,"b":41}]}],"statement":"DELETE FROM ziti_intercepts WHERE id = :id RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM ziti_intercepts WHERE id = :id RETURNING *
 * ```
 */
export const deleteZitiIntercept = new PreparedQuery<IDeleteZitiInterceptParams,IDeleteZitiInterceptResult>(deleteZitiInterceptIR);


/** Query 'UpdateZitiIntercept' is invalid, so its result is assigned type 'never'.
 *  */
export type IUpdateZitiInterceptResult = never;

/** Query 'UpdateZitiIntercept' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IUpdateZitiInterceptParams = never;

const updateZitiInterceptIR: any = {"usedParamSet":{"ziti_id":true,"port_ranges":true,"protocol":true,"addresses":true,"id":true},"params":[{"name":"ziti_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":39,"b":46}]},{"name":"port_ranges","required":false,"transform":{"type":"scalar"},"locs":[{"a":65,"b":76}]},{"name":"protocol","required":false,"transform":{"type":"scalar"},"locs":[{"a":92,"b":100}]},{"name":"addresses","required":false,"transform":{"type":"scalar"},"locs":[{"a":117,"b":126}]},{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":139,"b":141}]}],"statement":"UPDATE ziti_intercepts\nSET\n  ziti_id = :ziti_id,\n  port_ranges = :port_ranges,\n  protocol = :protocol,\n  addresses = :addresses\nWHERE id = :id\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE ziti_intercepts
 * SET
 *   ziti_id = :ziti_id,
 *   port_ranges = :port_ranges,
 *   protocol = :protocol,
 *   addresses = :addresses
 * WHERE id = :id
 * RETURNING *
 * ```
 */
export const updateZitiIntercept = new PreparedQuery<IUpdateZitiInterceptParams,IUpdateZitiInterceptResult>(updateZitiInterceptIR);


