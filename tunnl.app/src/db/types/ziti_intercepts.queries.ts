/** Types generated for queries found in "src/db/sql/ziti_intercepts.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type protocol = 'http' | 'tcp' | 'tcp/udp' | 'udp';

export type stringArray = (string)[];

/** 'InsertZitiIntercept' parameters type */
export interface IInsertZitiInterceptParams {
  addresses?: stringArray | null | void;
  name?: string | null | void;
  port_ranges?: string | null | void;
  protocol?: protocol | null | void;
  ziti_id?: string | null | void;
}

/** 'InsertZitiIntercept' return type */
export interface IInsertZitiInterceptResult {
  addresses: stringArray;
  id: string;
  name: string;
  port_ranges: string;
  protocol: protocol;
  ziti_id: string;
}

/** 'InsertZitiIntercept' query type */
export interface IInsertZitiInterceptQuery {
  params: IInsertZitiInterceptParams;
  result: IInsertZitiInterceptResult;
}

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


/** 'DeleteZitiIntercept' parameters type */
export interface IDeleteZitiInterceptParams {
  id?: string | null | void;
}

/** 'DeleteZitiIntercept' return type */
export interface IDeleteZitiInterceptResult {
  addresses: stringArray;
  id: string;
  name: string;
  port_ranges: string;
  protocol: protocol;
  ziti_id: string;
}

/** 'DeleteZitiIntercept' query type */
export interface IDeleteZitiInterceptQuery {
  params: IDeleteZitiInterceptParams;
  result: IDeleteZitiInterceptResult;
}

const deleteZitiInterceptIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":39,"b":41}]}],"statement":"DELETE FROM ziti_intercepts WHERE id = :id RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM ziti_intercepts WHERE id = :id RETURNING *
 * ```
 */
export const deleteZitiIntercept = new PreparedQuery<IDeleteZitiInterceptParams,IDeleteZitiInterceptResult>(deleteZitiInterceptIR);


