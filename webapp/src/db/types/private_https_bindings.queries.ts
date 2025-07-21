/** Types generated for queries found in "src/db/sql/private_https_bindings.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertPrivateHttpsBinding' parameters type */
export interface IInsertPrivateHttpsBindingParams {
  domain?: string | null | void;
  slug?: string | null | void;
  tunnel_binding_id?: string | null | void;
}

/** 'InsertPrivateHttpsBinding' return type */
export type IInsertPrivateHttpsBindingResult = void;

/** 'InsertPrivateHttpsBinding' query type */
export interface IInsertPrivateHttpsBindingQuery {
  params: IInsertPrivateHttpsBindingParams;
  result: IInsertPrivateHttpsBindingResult;
}

const insertPrivateHttpsBindingIR: any = {"usedParamSet":{"tunnel_binding_id":true,"slug":true,"domain":true},"params":[{"name":"tunnel_binding_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":264,"b":281},{"a":304,"b":321}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":328,"b":332}]},{"name":"domain","required":false,"transform":{"type":"scalar"},"locs":[{"a":339,"b":345}]}],"statement":"INSERT INTO private_https_bindings (\n    user_id,\n    tunnel_binding_id,\n    slug,\n    domain\n) VALUES (\n    (\n        SELECT user_id\n        FROM services\n        WHERE id = (\n            SELECT service_id \n            FROM tunnel_bindings\n            WHERE id = :tunnel_binding_id\n        )\n    ),\n    :tunnel_binding_id,\n    :slug,\n    :domain\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO private_https_bindings (
 *     user_id,
 *     tunnel_binding_id,
 *     slug,
 *     domain
 * ) VALUES (
 *     (
 *         SELECT user_id
 *         FROM services
 *         WHERE id = (
 *             SELECT service_id 
 *             FROM tunnel_bindings
 *             WHERE id = :tunnel_binding_id
 *         )
 *     ),
 *     :tunnel_binding_id,
 *     :slug,
 *     :domain
 * )
 * ```
 */
export const insertPrivateHttpsBinding = new PreparedQuery<IInsertPrivateHttpsBindingParams,IInsertPrivateHttpsBindingResult>(insertPrivateHttpsBindingIR);


