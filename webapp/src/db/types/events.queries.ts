/** Types generated for queries found in "src/db/sql/events.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'SelectZitiServiceDialsByZitiServiceId' parameters type */
export interface ISelectZitiServiceDialsByZitiServiceIdParams {
  interval?: DateOrString | null | void;
  ziti_service_id?: string | null | void;
}

/** 'SelectZitiServiceDialsByZitiServiceId' return type */
export interface ISelectZitiServiceDialsByZitiServiceIdResult {
  created_at: Date;
  data: Json;
  event_type: string;
  id: string;
}

/** 'SelectZitiServiceDialsByZitiServiceId' query type */
export interface ISelectZitiServiceDialsByZitiServiceIdQuery {
  params: ISelectZitiServiceDialsByZitiServiceIdParams;
  result: ISelectZitiServiceDialsByZitiServiceIdResult;
}

const selectZitiServiceDialsByZitiServiceIdIR: any = {"usedParamSet":{"ziti_service_id":true,"interval":true},"params":[{"name":"ziti_service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":106,"b":121}]},{"name":"interval","required":false,"transform":{"type":"scalar"},"locs":[{"a":154,"b":162}]}],"statement":"SELECT *\nFROM events\nWHERE event_type = 'ziti.service.service.dial.success'\n    AND data->>'service_id' = :ziti_service_id\n    AND created_at >= NOW() - (:interval)::interval\nORDER BY created_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM events
 * WHERE event_type = 'ziti.service.service.dial.success'
 *     AND data->>'service_id' = :ziti_service_id
 *     AND created_at >= NOW() - (:interval)::interval
 * ORDER BY created_at DESC
 * ```
 */
export const selectZitiServiceDialsByZitiServiceId = new PreparedQuery<ISelectZitiServiceDialsByZitiServiceIdParams,ISelectZitiServiceDialsByZitiServiceIdResult>(selectZitiServiceDialsByZitiServiceIdIR);


/** 'SelectZitiCircuitsByZitiServiceId' parameters type */
export interface ISelectZitiCircuitsByZitiServiceIdParams {
  interval?: DateOrString | null | void;
  ziti_service_id?: string | null | void;
}

/** 'SelectZitiCircuitsByZitiServiceId' return type */
export interface ISelectZitiCircuitsByZitiServiceIdResult {
  created_at: Date;
  data: Json;
  event_type: string;
  id: string;
}

/** 'SelectZitiCircuitsByZitiServiceId' query type */
export interface ISelectZitiCircuitsByZitiServiceIdQuery {
  params: ISelectZitiCircuitsByZitiServiceIdParams;
  result: ISelectZitiCircuitsByZitiServiceIdResult;
}

const selectZitiCircuitsByZitiServiceIdIR: any = {"usedParamSet":{"ziti_service_id":true,"interval":true},"params":[{"name":"ziti_service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":89,"b":104}]},{"name":"interval","required":false,"transform":{"type":"scalar"},"locs":[{"a":137,"b":145}]}],"statement":"SELECT *\nFROM events\nWHERE event_type LIKE 'ziti.circuit%'\n    AND data->>'service_id' = :ziti_service_id\n    AND created_at >= NOW() - (:interval)::interval\nORDER BY created_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM events
 * WHERE event_type LIKE 'ziti.circuit%'
 *     AND data->>'service_id' = :ziti_service_id
 *     AND created_at >= NOW() - (:interval)::interval
 * ORDER BY created_at DESC
 * ```
 */
export const selectZitiCircuitsByZitiServiceId = new PreparedQuery<ISelectZitiCircuitsByZitiServiceIdParams,ISelectZitiCircuitsByZitiServiceIdResult>(selectZitiCircuitsByZitiServiceIdIR);


/** 'SelectZitiCircuitCreatedEventsByZitiServiceId' parameters type */
export interface ISelectZitiCircuitCreatedEventsByZitiServiceIdParams {
  interval?: DateOrString | null | void;
  ziti_service_id?: string | null | void;
}

/** 'SelectZitiCircuitCreatedEventsByZitiServiceId' return type */
export interface ISelectZitiCircuitCreatedEventsByZitiServiceIdResult {
  created_at: Date;
  data: Json;
  event_type: string;
  id: string;
}

/** 'SelectZitiCircuitCreatedEventsByZitiServiceId' query type */
export interface ISelectZitiCircuitCreatedEventsByZitiServiceIdQuery {
  params: ISelectZitiCircuitCreatedEventsByZitiServiceIdParams;
  result: ISelectZitiCircuitCreatedEventsByZitiServiceIdResult;
}

const selectZitiCircuitCreatedEventsByZitiServiceIdIR: any = {"usedParamSet":{"ziti_service_id":true,"interval":true},"params":[{"name":"ziti_service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":93,"b":108}]},{"name":"interval","required":false,"transform":{"type":"scalar"},"locs":[{"a":141,"b":149}]}],"statement":"SELECT *\nFROM events\nWHERE event_type = 'ziti.circuit.created'\n    AND data->>'service_id' = :ziti_service_id\n    AND created_at >= NOW() - (:interval)::interval\nORDER BY created_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM events
 * WHERE event_type = 'ziti.circuit.created'
 *     AND data->>'service_id' = :ziti_service_id
 *     AND created_at >= NOW() - (:interval)::interval
 * ORDER BY created_at DESC
 * ```
 */
export const selectZitiCircuitCreatedEventsByZitiServiceId = new PreparedQuery<ISelectZitiCircuitCreatedEventsByZitiServiceIdParams,ISelectZitiCircuitCreatedEventsByZitiServiceIdResult>(selectZitiCircuitCreatedEventsByZitiServiceIdIR);


