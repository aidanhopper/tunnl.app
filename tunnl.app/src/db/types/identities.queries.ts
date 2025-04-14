/** Types generated for queries found in "src/db/sql/identities.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertIdentity' parameters type */
export interface IInsertIdentityParams {
  name?: string | null | void;
  slug?: string | null | void;
  user_id?: string | null | void;
}

/** 'InsertIdentity' return type */
export type IInsertIdentityResult = void;

/** 'InsertIdentity' query type */
export interface IInsertIdentityQuery {
  params: IInsertIdentityParams;
  result: IInsertIdentityResult;
}

const insertIdentityIR: any = {"usedParamSet":{"user_id":true,"name":true,"slug":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":73,"b":80}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":87,"b":91}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":98,"b":102}]}],"statement":"INSERT INTO identities (\n    user_id,\n    name,\n    slug \n) VALUES (\n    :user_id,\n    :name,\n    :slug\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO identities (
 *     user_id,
 *     name,
 *     slug 
 * ) VALUES (
 *     :user_id,
 *     :name,
 *     :slug
 * )
 * ```
 */
export const insertIdentity = new PreparedQuery<IInsertIdentityParams,IInsertIdentityResult>(insertIdentityIR);


/** 'InsertIdentityByEmail' parameters type */
export interface IInsertIdentityByEmailParams {
  email?: string | null | void;
  name?: string | null | void;
  slug?: string | null | void;
}

/** 'InsertIdentityByEmail' return type */
export type IInsertIdentityByEmailResult = void;

/** 'InsertIdentityByEmail' query type */
export interface IInsertIdentityByEmailQuery {
  params: IInsertIdentityByEmailParams;
  result: IInsertIdentityByEmailResult;
}

const insertIdentityByEmailIR: any = {"usedParamSet":{"email":true,"name":true,"slug":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":108,"b":113}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":121,"b":125}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":132,"b":136}]}],"statement":"INSERT INTO identities (\n    user_id,\n    name,\n    slug\n) VALUES (\n    (SELECT id FROM users WHERE email = :email),\n    :name,\n    :slug\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO identities (
 *     user_id,
 *     name,
 *     slug
 * ) VALUES (
 *     (SELECT id FROM users WHERE email = :email),
 *     :name,
 *     :slug
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
  name: string;
  slug: string;
  user_id: string;
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
  name: string;
  slug: string;
  user_id: string;
}

/** 'GetIdentitiesByEmail' query type */
export interface IGetIdentitiesByEmailQuery {
  params: IGetIdentitiesByEmailParams;
  result: IGetIdentitiesByEmailResult;
}

const getIdentitiesByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":92,"b":97}]}],"statement":"SELECT * \nFROM identities \nWHERE user_id = (\n    SELECT id\n    FROM users\n    WHERE email = :email\n)"};

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
  name: string;
  slug: string;
  user_id: string;
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


