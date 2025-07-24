/** Types generated for queries found in "src/db/sql/services.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type protocol = 'http' | 'tcp' | 'tcp/udp' | 'udp';

/** 'GetServicesByEmail' parameters type */
export interface IGetServicesByEmailParams {
  email?: string | null | void;
}

/** 'GetServicesByEmail' return type */
export interface IGetServicesByEmailResult {
  created: Date;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
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


/** 'InsertService' parameters type */
export interface IInsertServiceParams {
  name?: string | null | void;
  protocol?: protocol | null | void;
  slug?: string | null | void;
  user_id?: string | null | void;
}

/** 'InsertService' return type */
export interface IInsertServiceResult {
  created: Date;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
}

/** 'InsertService' query type */
export interface IInsertServiceQuery {
  params: IInsertServiceParams;
  result: IInsertServiceResult;
}

const insertServiceIR: any = {"usedParamSet":{"user_id":true,"slug":true,"name":true,"protocol":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":86,"b":93}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":100,"b":104}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":111,"b":115}]},{"name":"protocol","required":false,"transform":{"type":"scalar"},"locs":[{"a":122,"b":130}]}],"statement":"INSERT INTO services (\n    user_id,\n    slug, \n    name,\n    protocol \n) VALUES (\n    :user_id,\n    :slug,\n    :name,\n    :protocol\n) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO services (
 *     user_id,
 *     slug, 
 *     name,
 *     protocol 
 * ) VALUES (
 *     :user_id,
 *     :slug,
 *     :name,
 *     :protocol
 * ) RETURNING *
 * ```
 */
export const insertService = new PreparedQuery<IInsertServiceParams,IInsertServiceResult>(insertServiceIR);


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
  created: Date;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
}

/** 'GetServiceBySlug' query type */
export interface IGetServiceBySlugQuery {
  params: IGetServiceBySlugParams;
  result: IGetServiceBySlugResult;
}

const getServiceBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":41,"b":45}]}],"statement":"SELECT \n    *\nFROM services\nWHERE slug = :slug"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *     *
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
  created: Date;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
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


/** 'GetService' parameters type */
export interface IGetServiceParams {
  id?: string | null | void;
}

/** 'GetService' return type */
export interface IGetServiceResult {
  created: Date;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
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
  created: Date;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
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


/** 'SelectServicesByUserId' parameters type */
export interface ISelectServicesByUserIdParams {
  id?: string | null | void;
}

/** 'SelectServicesByUserId' return type */
export interface ISelectServicesByUserIdResult {
  created: Date;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
}

/** 'SelectServicesByUserId' query type */
export interface ISelectServicesByUserIdQuery {
  params: ISelectServicesByUserIdParams;
  result: ISelectServicesByUserIdResult;
}

const selectServicesByUserIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":39,"b":41}]}],"statement":"SELECT *\nFROM services\nWHERE user_id = :id\nORDER BY created DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM services
 * WHERE user_id = :id
 * ORDER BY created DESC
 * ```
 */
export const selectServicesByUserId = new PreparedQuery<ISelectServicesByUserIdParams,ISelectServicesByUserIdResult>(selectServicesByUserIdIR);


/** 'SelectServiceBySlug' parameters type */
export interface ISelectServiceBySlugParams {
  slug?: string | null | void;
}

/** 'SelectServiceBySlug' return type */
export interface ISelectServiceBySlugResult {
  created: Date;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
}

/** 'SelectServiceBySlug' query type */
export interface ISelectServiceBySlugQuery {
  params: ISelectServiceBySlugParams;
  result: ISelectServiceBySlugResult;
}

const selectServiceBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":36,"b":40}]}],"statement":"SELECT *\nFROM services\nWHERE slug = :slug"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM services
 * WHERE slug = :slug
 * ```
 */
export const selectServiceBySlug = new PreparedQuery<ISelectServiceBySlugParams,ISelectServiceBySlugResult>(selectServiceBySlugIR);


/** 'DeleteServiceBySlug' parameters type */
export interface IDeleteServiceBySlugParams {
  slug?: string | null | void;
}

/** 'DeleteServiceBySlug' return type */
export interface IDeleteServiceBySlugResult {
  created: Date;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
}

/** 'DeleteServiceBySlug' query type */
export interface IDeleteServiceBySlugQuery {
  params: IDeleteServiceBySlugParams;
  result: IDeleteServiceBySlugResult;
}

const deleteServiceBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":34,"b":38}]}],"statement":"DELETE FROM services\nWHERE slug = :slug\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM services
 * WHERE slug = :slug
 * RETURNING *
 * ```
 */
export const deleteServiceBySlug = new PreparedQuery<IDeleteServiceBySlugParams,IDeleteServiceBySlugResult>(deleteServiceBySlugIR);


