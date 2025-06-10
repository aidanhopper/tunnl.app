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


/** 'GetUserAndServiceByServiceSlug' parameters type */
export interface IGetUserAndServiceByServiceSlugParams {
  slug?: string | null | void;
}

/** 'GetUserAndServiceByServiceSlug' return type */
export interface IGetUserAndServiceByServiceSlugResult {
  email: string;
  service_id: string;
  service_slug: string;
  user_id: string;
}

/** 'GetUserAndServiceByServiceSlug' query type */
export interface IGetUserAndServiceByServiceSlugQuery {
  params: IGetUserAndServiceByServiceSlugParams;
  result: IGetUserAndServiceByServiceSlugResult;
}

const getUserAndServiceByServiceSlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":201,"b":205}]}],"statement":"SELECT\n    users.id AS user_id,\n    services.id AS service_id,\n    services.slug AS service_slug,\n    users.email AS email\nFROM services\nJOIN users ON users.id = services.user_id\nWHERE services.slug = :slug\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     users.id AS user_id,
 *     services.id AS service_id,
 *     services.slug AS service_slug,
 *     users.email AS email
 * FROM services
 * JOIN users ON users.id = services.user_id
 * WHERE services.slug = :slug
 * LIMIT 1
 * ```
 */
export const getUserAndServiceByServiceSlug = new PreparedQuery<IGetUserAndServiceByServiceSlugParams,IGetUserAndServiceByServiceSlugResult>(getUserAndServiceByServiceSlugIR);


