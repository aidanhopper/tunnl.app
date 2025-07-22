/** Types generated for queries found in "src/db/sql/private_https_bindings.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertPrivateHttpsBinding' parameters type */
export interface IInsertPrivateHttpsBindingParams {
  domain?: string | null | void;
  slug?: string | null | void;
  tunnel_binding_id?: string | null | void;
  ziti_id?: string | null | void;
}

/** 'InsertPrivateHttpsBinding' return type */
export type IInsertPrivateHttpsBindingResult = void;

/** 'InsertPrivateHttpsBinding' query type */
export interface IInsertPrivateHttpsBindingQuery {
  params: IInsertPrivateHttpsBindingParams;
  result: IInsertPrivateHttpsBindingResult;
}

const insertPrivateHttpsBindingIR: any = {"usedParamSet":{"tunnel_binding_id":true,"slug":true,"domain":true,"ziti_id":true},"params":[{"name":"tunnel_binding_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":277,"b":294},{"a":317,"b":334}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":341,"b":345}]},{"name":"domain","required":false,"transform":{"type":"scalar"},"locs":[{"a":352,"b":358}]},{"name":"ziti_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":365,"b":372}]}],"statement":"INSERT INTO private_https_bindings (\n    user_id,\n    tunnel_binding_id,\n    slug,\n    domain,\n    ziti_id\n) VALUES (\n    (\n        SELECT user_id\n        FROM services\n        WHERE id = (\n            SELECT service_id \n            FROM tunnel_bindings\n            WHERE id = :tunnel_binding_id\n        )\n    ),\n    :tunnel_binding_id,\n    :slug,\n    :domain,\n    :ziti_id\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO private_https_bindings (
 *     user_id,
 *     tunnel_binding_id,
 *     slug,
 *     domain,
 *     ziti_id
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
 *     :domain,
 *     :ziti_id
 * )
 * ```
 */
export const insertPrivateHttpsBinding = new PreparedQuery<IInsertPrivateHttpsBindingParams,IInsertPrivateHttpsBindingResult>(insertPrivateHttpsBindingIR);


/** 'GetPrivateHttpsBindingsByUser' parameters type */
export interface IGetPrivateHttpsBindingsByUserParams {
  user_id?: string | null | void;
}

/** 'GetPrivateHttpsBindingsByUser' return type */
export interface IGetPrivateHttpsBindingsByUserResult {
  domain: string;
  id: string;
  service_slug: string;
  slug: string;
  tunnel_binding_id: string;
  user_id: string;
  ziti_id: string;
}

/** 'GetPrivateHttpsBindingsByUser' query type */
export interface IGetPrivateHttpsBindingsByUserQuery {
  params: IGetPrivateHttpsBindingsByUserParams;
  result: IGetPrivateHttpsBindingsByUserResult;
}

const getPrivateHttpsBindingsByUserIR: any = {"usedParamSet":{"user_id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":283,"b":290}]}],"statement":"SELECT \n    private_https_bindings.*,\n    services.slug AS service_slug\nFROM private_https_bindings\nJOIN tunnel_bindings ON tunnel_bindings.id = private_https_bindings.tunnel_binding_id\nJOIN services ON services.id = tunnel_bindings.service_id\nWHERE private_https_bindings.user_id = :user_id AND services.enabled = true"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *     private_https_bindings.*,
 *     services.slug AS service_slug
 * FROM private_https_bindings
 * JOIN tunnel_bindings ON tunnel_bindings.id = private_https_bindings.tunnel_binding_id
 * JOIN services ON services.id = tunnel_bindings.service_id
 * WHERE private_https_bindings.user_id = :user_id AND services.enabled = true
 * ```
 */
export const getPrivateHttpsBindingsByUser = new PreparedQuery<IGetPrivateHttpsBindingsByUserParams,IGetPrivateHttpsBindingsByUserResult>(getPrivateHttpsBindingsByUserIR);


/** 'GetPrivateHttpsBinding' parameters type */
export interface IGetPrivateHttpsBindingParams {
  id?: string | null | void;
}

/** 'GetPrivateHttpsBinding' return type */
export interface IGetPrivateHttpsBindingResult {
  domain: string;
  email: string;
  id: string;
  service_slug: string;
  slug: string;
  tunnel_binding_id: string;
  user_id: string;
  ziti_id: string;
}

/** 'GetPrivateHttpsBinding' query type */
export interface IGetPrivateHttpsBindingQuery {
  params: IGetPrivateHttpsBindingParams;
  result: IGetPrivateHttpsBindingResult;
}

const getPrivateHttpsBindingIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":337,"b":339}]}],"statement":"SELECT \n    private_https_bindings.*,\n    services.slug AS service_slug,\n    users.email\nFROM private_https_bindings\nJOIN tunnel_bindings ON tunnel_bindings.id = private_https_bindings.tunnel_binding_id\nJOIN services ON services.id = tunnel_bindings.service_id\nJOIN users ON users.id = services.user_id\nWHERE private_https_bindings.id = :id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *     private_https_bindings.*,
 *     services.slug AS service_slug,
 *     users.email
 * FROM private_https_bindings
 * JOIN tunnel_bindings ON tunnel_bindings.id = private_https_bindings.tunnel_binding_id
 * JOIN services ON services.id = tunnel_bindings.service_id
 * JOIN users ON users.id = services.user_id
 * WHERE private_https_bindings.id = :id
 * ```
 */
export const getPrivateHttpsBinding = new PreparedQuery<IGetPrivateHttpsBindingParams,IGetPrivateHttpsBindingResult>(getPrivateHttpsBindingIR);


/** 'DeletePrivateHttpsBindingDb' parameters type */
export interface IDeletePrivateHttpsBindingDbParams {
  id?: string | null | void;
}

/** 'DeletePrivateHttpsBindingDb' return type */
export type IDeletePrivateHttpsBindingDbResult = void;

/** 'DeletePrivateHttpsBindingDb' query type */
export interface IDeletePrivateHttpsBindingDbQuery {
  params: IDeletePrivateHttpsBindingDbParams;
  result: IDeletePrivateHttpsBindingDbResult;
}

const deletePrivateHttpsBindingDbIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":69,"b":71}]}],"statement":"DELETE FROM private_https_bindings\nWHERE private_https_bindings.id = :id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM private_https_bindings
 * WHERE private_https_bindings.id = :id
 * ```
 */
export const deletePrivateHttpsBindingDb = new PreparedQuery<IDeletePrivateHttpsBindingDbParams,IDeletePrivateHttpsBindingDbResult>(deletePrivateHttpsBindingDbIR);


