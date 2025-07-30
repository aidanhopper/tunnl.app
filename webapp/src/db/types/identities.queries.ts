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
export interface IInsertIdentityResult {
  created: Date;
  id: string;
  is_online: boolean;
  last_seen: Date | null;
  name: string;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'InsertIdentity' query type */
export interface IInsertIdentityQuery {
  params: IInsertIdentityParams;
  result: IInsertIdentityResult;
}

const insertIdentityIR: any = {"usedParamSet":{"user_id":true,"name":true,"slug":true,"ziti_id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":85,"b":92}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":99,"b":103}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":110,"b":114}]},{"name":"ziti_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":121,"b":128}]}],"statement":"INSERT INTO identities (\n    user_id,\n    name,\n    slug,\n    ziti_id\n) VALUES (\n    :user_id,\n    :name,\n    :slug,\n    :ziti_id\n) RETURNING *"};

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
 * ) RETURNING *
 * ```
 */
export const insertIdentity = new PreparedQuery<IInsertIdentityParams,IInsertIdentityResult>(insertIdentityIR);


/** 'SelectIdentitiesByUserId' parameters type */
export interface ISelectIdentitiesByUserIdParams {
  id?: string | null | void;
}

/** 'SelectIdentitiesByUserId' return type */
export interface ISelectIdentitiesByUserIdResult {
  created: Date;
  id: string;
  is_online: boolean;
  last_seen: Date | null;
  name: string;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'SelectIdentitiesByUserId' query type */
export interface ISelectIdentitiesByUserIdQuery {
  params: ISelectIdentitiesByUserIdParams;
  result: ISelectIdentitiesByUserIdResult;
}

const selectIdentitiesByUserIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":41,"b":43}]}],"statement":"SELECT *\nFROM identities\nWHERE user_id = :id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM identities
 * WHERE user_id = :id
 * ```
 */
export const selectIdentitiesByUserId = new PreparedQuery<ISelectIdentitiesByUserIdParams,ISelectIdentitiesByUserIdResult>(selectIdentitiesByUserIdIR);


/** 'SelectIdentityBySlug' parameters type */
export interface ISelectIdentityBySlugParams {
  slug?: string | null | void;
}

/** 'SelectIdentityBySlug' return type */
export interface ISelectIdentityBySlugResult {
  created: Date;
  id: string;
  is_online: boolean;
  last_seen: Date | null;
  name: string;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'SelectIdentityBySlug' query type */
export interface ISelectIdentityBySlugQuery {
  params: ISelectIdentityBySlugParams;
  result: ISelectIdentityBySlugResult;
}

const selectIdentityBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":38,"b":42}]}],"statement":"SELECT *\nFROM identities\nWHERE slug = :slug"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM identities
 * WHERE slug = :slug
 * ```
 */
export const selectIdentityBySlug = new PreparedQuery<ISelectIdentityBySlugParams,ISelectIdentityBySlugResult>(selectIdentityBySlugIR);


/** 'DeleteIdentityBySlug' parameters type */
export interface IDeleteIdentityBySlugParams {
  slug?: string | null | void;
}

/** 'DeleteIdentityBySlug' return type */
export interface IDeleteIdentityBySlugResult {
  created: Date;
  id: string;
  is_online: boolean;
  last_seen: Date | null;
  name: string;
  slug: string;
  user_id: string;
  ziti_id: string;
}

/** 'DeleteIdentityBySlug' query type */
export interface IDeleteIdentityBySlugQuery {
  params: IDeleteIdentityBySlugParams;
  result: IDeleteIdentityBySlugResult;
}

const deleteIdentityBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":36,"b":40}]}],"statement":"DELETE FROM identities\nWHERE slug = :slug\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM identities
 * WHERE slug = :slug
 * RETURNING *
 * ```
 */
export const deleteIdentityBySlug = new PreparedQuery<IDeleteIdentityBySlugParams,IDeleteIdentityBySlugResult>(deleteIdentityBySlugIR);


/** 'SelectUserByZitiIdentityId' parameters type */
export interface ISelectUserByZitiIdentityIdParams {
  ziti_identity_id?: string | null | void;
}

/** 'SelectUserByZitiIdentityId' return type */
export interface ISelectUserByZitiIdentityIdResult {
  email: string;
  id: string;
  last_login: Date;
  roles: string;
}

/** 'SelectUserByZitiIdentityId' query type */
export interface ISelectUserByZitiIdentityIdQuery {
  params: ISelectUserByZitiIdentityIdParams;
  result: ISelectUserByZitiIdentityIdResult;
}

const selectUserByZitiIdentityIdIR: any = {"usedParamSet":{"ziti_identity_id":true},"params":[{"name":"ziti_identity_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":102,"b":118}]}],"statement":"SELECT users.*\nFROM identities\nJOIN users ON identities.user_id = users.id\nWHERE identities.ziti_id = :ziti_identity_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT users.*
 * FROM identities
 * JOIN users ON identities.user_id = users.id
 * WHERE identities.ziti_id = :ziti_identity_id
 * ```
 */
export const selectUserByZitiIdentityId = new PreparedQuery<ISelectUserByZitiIdentityIdParams,ISelectUserByZitiIdentityIdResult>(selectUserByZitiIdentityIdIR);


