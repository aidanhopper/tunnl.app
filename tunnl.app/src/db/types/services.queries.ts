/** Types generated for queries found in "src/db/sql/services.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetServicesByEmail' parameters type */
export interface IGetServicesByEmailParams {
  email?: string | null | void;
}

/** 'GetServicesByEmail' return type */
export interface IGetServicesByEmailResult {
  created: Date | null;
  id: string;
  name: string;
  slug: string;
  user_id: string;
}

/** 'GetServicesByEmail' query type */
export interface IGetServicesByEmailQuery {
  params: IGetServicesByEmailParams;
  result: IGetServicesByEmailResult;
}

const getServicesByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":93,"b":98}]}],"statement":"SELECT *\nFROM services\nWHERE user_id = (\n    SELECT user_id\n    FROM users\n    WHERE email = :email\n)\nORDER BY created DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM services
 * WHERE user_id = (
 *     SELECT user_id
 *     FROM users
 *     WHERE email = :email
 * )
 * ORDER BY created DESC
 * ```
 */
export const getServicesByEmail = new PreparedQuery<IGetServicesByEmailParams,IGetServicesByEmailResult>(getServicesByEmailIR);


