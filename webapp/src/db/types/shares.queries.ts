/** Types generated for queries found in "src/db/sql/shares.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** Query 'InsertShareByEmail' is invalid, so its result is assigned type 'never'.
 *  */
export type IInsertShareByEmailResult = never;

/** Query 'InsertShareByEmail' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IInsertShareByEmailParams = never;

const insertShareByEmailIR: any = {"usedParamSet":{"tunnel_binding_id":true,"email":true},"params":[{"name":"tunnel_binding_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":71,"b":88}]},{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":156,"b":161}]}],"statement":"INSERT INTO shares (\n    tunnel_binding_id,\n    user_id\n) VALUES (\n    :tunnel_binding_id,\n    (\n        SELECT id\n        FROM users\n        WHERE email = :email\n    )\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO shares (
 *     tunnel_binding_id,
 *     user_id
 * ) VALUES (
 *     :tunnel_binding_id,
 *     (
 *         SELECT id
 *         FROM users
 *         WHERE email = :email
 *     )
 * )
 * ```
 */
export const insertShareByEmail = new PreparedQuery<IInsertShareByEmailParams,IInsertShareByEmailResult>(insertShareByEmailIR);


