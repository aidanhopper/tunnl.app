/** Types generated for queries found in "src/db/sql/service_dials.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetServiceDialsByServiceId' parameters type */
export interface IGetServiceDialsByServiceIdParams {
  service_id?: string | null | void;
}

/** 'GetServiceDialsByServiceId' return type */
export interface IGetServiceDialsByServiceIdResult {
  dials: number;
  id: string;
  service_id: string;
  timestamp: Date;
}

/** 'GetServiceDialsByServiceId' query type */
export interface IGetServiceDialsByServiceIdQuery {
  params: IGetServiceDialsByServiceIdParams;
  result: IGetServiceDialsByServiceIdResult;
}

const getServiceDialsByServiceIdIR: any = {"usedParamSet":{"service_id":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":47,"b":57}]}],"statement":"SELECT *\nFROM service_dials\nWHERE service_id = :service_id\n  AND timestamp >= NOW() - INTERVAL '24 hours'\nORDER BY timestamp ASC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM service_dials
 * WHERE service_id = :service_id
 *   AND timestamp >= NOW() - INTERVAL '24 hours'
 * ORDER BY timestamp ASC
 * ```
 */
export const getServiceDialsByServiceId = new PreparedQuery<IGetServiceDialsByServiceIdParams,IGetServiceDialsByServiceIdResult>(getServiceDialsByServiceIdIR);


