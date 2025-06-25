/** Types generated for queries found in "src/db/sql/identities.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertIdentity' parameters type */
export interface IInsertIdentityParams {
  name?: string | null | void;
  slug?: string | null | void;
  user_id?: string | null | void;
  ziti_id?: string | null | void;
}

/** 'InsertIdentity' return type */
export type IInsertIdentityResult = void;

/** 'InsertIdentity' query type */
export interface IInsertIdentityQuery {
  params: IInsertIdentityParams;
  result: IInsertIdentityResult;
}

const insertIdentityIR: any = {"usedParamSet":{"user_id":true,"name":true,"slug":true,"ziti_id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":85,"b":92}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":99,"b":103}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":110,"b":114}]},{"name":"ziti_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":121,"b":128}]}],"statement":"INSERT INTO identities (\n    user_id,\n    name,\n    slug,\n    ziti_id\n) VALUES (\n    :user_id,\n    :name,\n    :slug,\n    :ziti_id\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO identities (
 *     user_id,
 *     name,
 *     slug,
 *     ziti_id
 * ) VALUES (
 *     :user_id,
 *     :name,
 *     :slug,
 *     :ziti_id
 * )
 * ```
 */
export const insertIdentity = new PreparedQuery<IInsertIdentityParams,IInsertIdentityResult>(insertIdentityIR);


/** 'InsertIdentityByEmail' parameters type */
export interface IInsertIdentityByEmailParams {
  email?: string | null | void;
  name?: string | null | void;
  slug?: string | null | void;
  ziti_id?: string | null | void;
}

/** 'InsertIdentityByEmail' return type */
export type IInsertIdentityByEmailResult = void;

/** 'InsertIdentityByEmail' query type */
export interface IInsertIdentityByEmailQuery {
  params: IInsertIdentityByEmailParams;
  result: IInsertIdentityByEmailResult;
}

const insertIdentityByEmailIR: any = {"usedParamSet":{"email":true,"name":true,"slug":true,"ziti_id":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":121,"b":126}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":134,"b":138}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":145,"b":149}]},{"name":"ziti_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":156,"b":163}]}],"statement":"INSERT INTO identities (\n    user_id,\n    name,\n    slug,\n    ziti_id\n) VALUES (\n    (SELECT id FROM users WHERE email = :email),\n    :name,\n    :slug,\n    :ziti_id\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO identities (
 *     user_id,
 *     name,
 *     slug,
 *     ziti_id
 * ) VALUES (
 *     (SELECT id FROM users WHERE email = :email),
 *     :name,
 *     :slug,
 *     :ziti_id
 * )
 * ```
 */
export const insertIdentityByEmail = new PreparedQuery<IInsertIdentityByEmailParams,IInsertIdentityByEmailResult>(insertIdentityByEmailIR);


/** 'GetIdentityById' parameters type */
export interface IGetIdentityByIdParams {
  id?: string | null | void;
}

/** 'GetIdentityById' return type */
export interface IGetIdentityByIdResult {
  created: Date | null;
  id: string;
  is_online: boolean | null;
  last_seen: Date | null;
  name: string;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'GetIdentityById' query type */
export interface IGetIdentityByIdQuery {
  params: IGetIdentityByIdParams;
  result: IGetIdentityByIdResult;
}

const getIdentityByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":36,"b":38}]}],"statement":"SELECT * FROM identities WHERE id = :id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM identities WHERE id = :id
 * ```
 */
export const getIdentityById = new PreparedQuery<IGetIdentityByIdParams,IGetIdentityByIdResult>(getIdentityByIdIR);


/** 'GetIdentitiesByEmail' parameters type */
export interface IGetIdentitiesByEmailParams {
  email?: string | null | void;
}

/** 'GetIdentitiesByEmail' return type */
export interface IGetIdentitiesByEmailResult {
  created: Date | null;
  id: string;
  is_online: boolean | null;
  last_seen: Date | null;
  name: string;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'GetIdentitiesByEmail' query type */
export interface IGetIdentitiesByEmailQuery {
  params: IGetIdentitiesByEmailParams;
  result: IGetIdentitiesByEmailResult;
}

const getIdentitiesByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":92,"b":97}]}],"statement":"SELECT * \nFROM identities \nWHERE user_id = (\n    SELECT id\n    FROM users\n    WHERE email = :email\n)\nORDER BY created DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * 
 * FROM identities 
 * WHERE user_id = (
 *     SELECT id
 *     FROM users
 *     WHERE email = :email
 * )
 * ORDER BY created DESC
 * ```
 */
export const getIdentitiesByEmail = new PreparedQuery<IGetIdentitiesByEmailParams,IGetIdentitiesByEmailResult>(getIdentitiesByEmailIR);


/** 'GetIdentityByNameAndEmail' parameters type */
export interface IGetIdentityByNameAndEmailParams {
  email?: string | null | void;
  name?: string | null | void;
}

/** 'GetIdentityByNameAndEmail' return type */
export interface IGetIdentityByNameAndEmailResult {
  created: Date | null;
  id: string;
  is_online: boolean | null;
  last_seen: Date | null;
  name: string;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'GetIdentityByNameAndEmail' query type */
export interface IGetIdentityByNameAndEmailQuery {
  params: IGetIdentityByNameAndEmailParams;
  result: IGetIdentityByNameAndEmailResult;
}

const getIdentityByNameAndEmailIR: any = {"usedParamSet":{"email":true,"name":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":92,"b":97}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":112,"b":116}]}],"statement":"SELECT * \nFROM identities \nWHERE user_id = (\n    SELECT id\n    FROM users\n    WHERE email = :email\n) AND name = :name"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * 
 * FROM identities 
 * WHERE user_id = (
 *     SELECT id
 *     FROM users
 *     WHERE email = :email
 * ) AND name = :name
 * ```
 */
export const getIdentityByNameAndEmail = new PreparedQuery<IGetIdentityByNameAndEmailParams,IGetIdentityByNameAndEmailResult>(getIdentityByNameAndEmailIR);


/** 'DeleteIdentityByEmail' parameters type */
export interface IDeleteIdentityByEmailParams {
  email?: string | null | void;
  name?: string | null | void;
}

/** 'DeleteIdentityByEmail' return type */
export type IDeleteIdentityByEmailResult = void;

/** 'DeleteIdentityByEmail' query type */
export interface IDeleteIdentityByEmailQuery {
  params: IDeleteIdentityByEmailParams;
  result: IDeleteIdentityByEmailResult;
}

const deleteIdentityByEmailIR: any = {"usedParamSet":{"email":true,"name":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":88,"b":93}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":108,"b":112}]}],"statement":"DELETE FROM identities\nWHERE user_id = (\n    SELECT id\n    FROM users\n    WHERE email = :email\n) AND name = :name"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM identities
 * WHERE user_id = (
 *     SELECT id
 *     FROM users
 *     WHERE email = :email
 * ) AND name = :name
 * ```
 */
export const deleteIdentityByEmail = new PreparedQuery<IDeleteIdentityByEmailParams,IDeleteIdentityByEmailResult>(deleteIdentityByEmailIR);


/** 'GetIdentityBySlug' parameters type */
export interface IGetIdentityBySlugParams {
  slug?: string | null | void;
}

/** 'GetIdentityBySlug' return type */
export interface IGetIdentityBySlugResult {
  created: Date | null;
  id: string;
  is_online: boolean | null;
  last_seen: Date | null;
  name: string;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'GetIdentityBySlug' query type */
export interface IGetIdentityBySlugQuery {
  params: IGetIdentityBySlugParams;
  result: IGetIdentityBySlugResult;
}

const getIdentityBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":40,"b":44}]}],"statement":"SELECT * \nFROM identities \nWHERE slug = :slug\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * 
 * FROM identities 
 * WHERE slug = :slug
 * LIMIT 1
 * ```
 */
export const getIdentityBySlug = new PreparedQuery<IGetIdentityBySlugParams,IGetIdentityBySlugResult>(getIdentityBySlugIR);


/** 'GetUserIdentities' parameters type */
export interface IGetUserIdentitiesParams {
  user_id?: string | null | void;
}

/** 'GetUserIdentities' return type */
export interface IGetUserIdentitiesResult {
  created: Date | null;
  id: string;
  is_online: boolean | null;
  last_seen: Date | null;
  name: string;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'GetUserIdentities' query type */
export interface IGetUserIdentitiesQuery {
  params: IGetUserIdentitiesParams;
  result: IGetUserIdentitiesResult;
}

const getUserIdentitiesIR: any = {"usedParamSet":{"user_id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":41,"b":48}]}],"statement":"SELECT *\nFROM identities\nWHERE user_id = :user_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM identities
 * WHERE user_id = :user_id
 * ```
 */
export const getUserIdentities = new PreparedQuery<IGetUserIdentitiesParams,IGetUserIdentitiesResult>(getUserIdentitiesIR);


