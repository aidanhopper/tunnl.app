/** Types generated for queries found in "src/db/sql/services.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type protocol = 'http' | 'tcp' | 'tcp/udp' | 'udp';

/** 'GetServicesByEmail' parameters type */
export interface IGetServicesByEmailParams {
  email?: string | null | void;
}

/** 'GetServicesByEmail' return type */
export interface IGetServicesByEmailResult {
  created: Date | null;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'GetServicesByEmail' query type */
export interface IGetServicesByEmailQuery {
  params: IGetServicesByEmailParams;
  result: IGetServicesByEmailResult;
}

const getServicesByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":88,"b":93}]}],"statement":"SELECT *\nFROM services\nWHERE user_id = (\n    SELECT id\n    FROM users\n    WHERE email = :email\n)\nORDER BY created DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM services
 * WHERE user_id = (
 *     SELECT id
 *     FROM users
 *     WHERE email = :email
 * )
 * ORDER BY created DESC
 * ```
 */
export const getServicesByEmail = new PreparedQuery<IGetServicesByEmailParams,IGetServicesByEmailResult>(getServicesByEmailIR);


/** 'InsertServiceByEmail' parameters type */
export interface IInsertServiceByEmailParams {
  email?: string | null | void;
  name?: string | null | void;
  protocol?: protocol | null | void;
  slug?: string | null | void;
  ziti_id?: string | null | void;
}

/** 'InsertServiceByEmail' return type */
export type IInsertServiceByEmailResult = void;

/** 'InsertServiceByEmail' query type */
export interface IInsertServiceByEmailQuery {
  params: IInsertServiceByEmailParams;
  result: IInsertServiceByEmailResult;
}

const insertServiceByEmailIR: any = {"usedParamSet":{"email":true,"slug":true,"name":true,"ziti_id":true,"protocol":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":135,"b":140}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":148,"b":152}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":159,"b":163}]},{"name":"ziti_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":170,"b":177}]},{"name":"protocol","required":false,"transform":{"type":"scalar"},"locs":[{"a":184,"b":192}]}],"statement":"INSERT INTO services (\n    user_id,\n    slug, \n    name,\n    ziti_id,\n    protocol \n) VALUES (\n    (SELECT id FROM users WHERE email = :email),\n    :slug,\n    :name,\n    :ziti_id,\n    :protocol\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO services (
 *     user_id,
 *     slug, 
 *     name,
 *     ziti_id,
 *     protocol 
 * ) VALUES (
 *     (SELECT id FROM users WHERE email = :email),
 *     :slug,
 *     :name,
 *     :ziti_id,
 *     :protocol
 * )
 * ```
 */
export const insertServiceByEmail = new PreparedQuery<IInsertServiceByEmailParams,IInsertServiceByEmailResult>(insertServiceByEmailIR);


/** 'DeleteServiceByNameAndEmail' parameters type */
export interface IDeleteServiceByNameAndEmailParams {
  email?: string | null | void;
  name?: string | null | void;
}

/** 'DeleteServiceByNameAndEmail' return type */
export type IDeleteServiceByNameAndEmailResult = void;

/** 'DeleteServiceByNameAndEmail' query type */
export interface IDeleteServiceByNameAndEmailQuery {
  params: IDeleteServiceByNameAndEmailParams;
  result: IDeleteServiceByNameAndEmailResult;
}

const deleteServiceByNameAndEmailIR: any = {"usedParamSet":{"email":true,"name":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":87,"b":92}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":107,"b":111}]}],"statement":"DELETE FROM services\nWHERE user_id = (\n    SELECT id\n    FROM users \n    WHERE email = :email\n) AND name = :name"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM services
 * WHERE user_id = (
 *     SELECT id
 *     FROM users 
 *     WHERE email = :email
 * ) AND name = :name
 * ```
 */
export const deleteServiceByNameAndEmail = new PreparedQuery<IDeleteServiceByNameAndEmailParams,IDeleteServiceByNameAndEmailResult>(deleteServiceByNameAndEmailIR);


/** 'GetServiceBySlug' parameters type */
export interface IGetServiceBySlugParams {
  slug?: string | null | void;
}

/** 'GetServiceBySlug' return type */
export interface IGetServiceBySlugResult {
  created: Date | null;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'GetServiceBySlug' query type */
export interface IGetServiceBySlugQuery {
  params: IGetServiceBySlugParams;
  result: IGetServiceBySlugResult;
}

const getServiceBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":36,"b":40}]}],"statement":"SELECT *\nFROM services\nWHERE slug = :slug"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM services
 * WHERE slug = :slug
 * ```
 */
export const getServiceBySlug = new PreparedQuery<IGetServiceBySlugParams,IGetServiceBySlugResult>(getServiceBySlugIR);


/** 'GetServiceByNameAndEmail' parameters type */
export interface IGetServiceByNameAndEmailParams {
  email?: string | null | void;
  name?: string | null | void;
}

/** 'GetServiceByNameAndEmail' return type */
export interface IGetServiceByNameAndEmailResult {
  created: Date | null;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'GetServiceByNameAndEmail' query type */
export interface IGetServiceByNameAndEmailQuery {
  params: IGetServiceByNameAndEmailParams;
  result: IGetServiceByNameAndEmailResult;
}

const getServiceByNameAndEmailIR: any = {"usedParamSet":{"email":true,"name":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":88,"b":93}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":108,"b":112}]}],"statement":"SELECT *\nFROM services\nWHERE user_id = (\n    SELECT id\n    FROM users\n    WHERE email = :email\n) AND name = :name"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM services
 * WHERE user_id = (
 *     SELECT id
 *     FROM users
 *     WHERE email = :email
 * ) AND name = :name
 * ```
 */
export const getServiceByNameAndEmail = new PreparedQuery<IGetServiceByNameAndEmailParams,IGetServiceByNameAndEmailResult>(getServiceByNameAndEmailIR);


/** 'GetUserServiceAndIdentityBySlugs' parameters type */
export interface IGetUserServiceAndIdentityBySlugsParams {
  identity_slug?: string | null | void;
  service_slug?: string | null | void;
}

/** 'GetUserServiceAndIdentityBySlugs' return type */
export interface IGetUserServiceAndIdentityBySlugsResult {
  email: string;
  identity_id: string;
  identity_slug: string;
  identity_ziti_id: string;
  service_id: string;
  service_slug: string;
  service_ziti_id: string;
  user_id: string;
}

/** 'GetUserServiceAndIdentityBySlugs' query type */
export interface IGetUserServiceAndIdentityBySlugsQuery {
  params: IGetUserServiceAndIdentityBySlugsParams;
  result: IGetUserServiceAndIdentityBySlugsResult;
}

const getUserServiceAndIdentityBySlugsIR: any = {"usedParamSet":{"service_slug":true,"identity_slug":true},"params":[{"name":"service_slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":412,"b":424}]},{"name":"identity_slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":450,"b":463}]}],"statement":"SELECT\n    users.id AS user_id,\n    users.email AS email,\n    services.id AS service_id,\n    services.ziti_id AS service_ziti_id,\n    services.slug AS service_slug,\n    identities.id AS identity_id,\n    identities.ziti_id AS identity_ziti_id,\n    identities.slug AS identity_slug\nFROM services\nJOIN users ON users.id = services.user_id\nLEFT JOIN identities ON identities.user_id = users.id\nWHERE services.slug = :service_slug\n  AND identities.slug = :identity_slug"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     users.id AS user_id,
 *     users.email AS email,
 *     services.id AS service_id,
 *     services.ziti_id AS service_ziti_id,
 *     services.slug AS service_slug,
 *     identities.id AS identity_id,
 *     identities.ziti_id AS identity_ziti_id,
 *     identities.slug AS identity_slug
 * FROM services
 * JOIN users ON users.id = services.user_id
 * LEFT JOIN identities ON identities.user_id = users.id
 * WHERE services.slug = :service_slug
 *   AND identities.slug = :identity_slug
 * ```
 */
export const getUserServiceAndIdentityBySlugs = new PreparedQuery<IGetUserServiceAndIdentityBySlugsParams,IGetUserServiceAndIdentityBySlugsResult>(getUserServiceAndIdentityBySlugsIR);


/** 'GetService' parameters type */
export interface IGetServiceParams {
  id?: string | null | void;
}

/** 'GetService' return type */
export interface IGetServiceResult {
  created: Date | null;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'GetService' query type */
export interface IGetServiceQuery {
  params: IGetServiceParams;
  result: IGetServiceResult;
}

const getServiceIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":34,"b":36}]}],"statement":"SELECT *\nFROM services\nWHERE id = :id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM services
 * WHERE id = :id
 * ```
 */
export const getService = new PreparedQuery<IGetServiceParams,IGetServiceResult>(getServiceIR);


/** 'GetServiceByIdAndEmail' parameters type */
export interface IGetServiceByIdAndEmailParams {
  email?: string | null | void;
  id?: string | null | void;
}

/** 'GetServiceByIdAndEmail' return type */
export interface IGetServiceByIdAndEmailResult {
  created: Date | null;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'GetServiceByIdAndEmail' query type */
export interface IGetServiceByIdAndEmailQuery {
  params: IGetServiceByIdAndEmailParams;
  result: IGetServiceByIdAndEmailResult;
}

const getServiceByIdAndEmailIR: any = {"usedParamSet":{"email":true,"id":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":89,"b":94}]},{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":107,"b":109}]}],"statement":"SELECT *\nFROM services\nWHERE user_id = (\n    SELECT id \n    FROM users\n    WHERE email = :email\n) AND id = :id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM services
 * WHERE user_id = (
 *     SELECT id 
 *     FROM users
 *     WHERE email = :email
 * ) AND id = :id
 * ```
 */
export const getServiceByIdAndEmail = new PreparedQuery<IGetServiceByIdAndEmailParams,IGetServiceByIdAndEmailResult>(getServiceByIdAndEmailIR);


/** 'EnableServiceDb' parameters type */
export interface IEnableServiceDbParams {
  service_id?: string | null | void;
}

/** 'EnableServiceDb' return type */
export type IEnableServiceDbResult = void;

/** 'EnableServiceDb' query type */
export interface IEnableServiceDbQuery {
  params: IEnableServiceDbParams;
  result: IEnableServiceDbResult;
}

const enableServiceDbIR: any = {"usedParamSet":{"service_id":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":46,"b":56}]}],"statement":"UPDATE services\nSET enabled = TRUE\nWHERE id = :service_id"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE services
 * SET enabled = TRUE
 * WHERE id = :service_id
 * ```
 */
export const enableServiceDb = new PreparedQuery<IEnableServiceDbParams,IEnableServiceDbResult>(enableServiceDbIR);


/** 'DisableServiceDb' parameters type */
export interface IDisableServiceDbParams {
  service_id?: string | null | void;
}

/** 'DisableServiceDb' return type */
export type IDisableServiceDbResult = void;

/** 'DisableServiceDb' query type */
export interface IDisableServiceDbQuery {
  params: IDisableServiceDbParams;
  result: IDisableServiceDbResult;
}

const disableServiceDbIR: any = {"usedParamSet":{"service_id":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":47,"b":57}]}],"statement":"UPDATE services\nSET enabled = FALSE\nWHERE id = :service_id"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE services
 * SET enabled = FALSE
 * WHERE id = :service_id
 * ```
 */
export const disableServiceDb = new PreparedQuery<IDisableServiceDbParams,IDisableServiceDbResult>(disableServiceDbIR);


