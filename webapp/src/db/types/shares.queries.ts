/** Types generated for queries found in "src/db/sql/shares.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertShare' parameters type */
export interface IInsertShareParams {
  service_id?: string | null | void;
  slug?: string | null | void;
  user_id?: string | null | void;
}

/** 'InsertShare' return type */
export interface IInsertShareResult {
  grantee_email: string;
  granter_email: string;
  id: string;
  service_id: string;
  slug: string;
  user_id: string;
}

/** 'InsertShare' query type */
export interface IInsertShareQuery {
  params: IInsertShareParams;
  result: IInsertShareResult;
}

const insertShareIR: any = {"usedParamSet":{"service_id":true,"user_id":true,"slug":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":124,"b":134}]},{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":145,"b":152}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":163,"b":167}]}],"statement":"WITH inserted_shares AS (\n    INSERT INTO shares (\n        service_id,\n        user_id,\n        slug\n    ) VALUES (\n        :service_id,\n        :user_id,\n        :slug\n    ) RETURNING *\n)\nSELECT \n    inserted_shares.*,\n    grantee.email AS grantee_email,\n    granter.email AS granter_email\nFROM inserted_shares\nJOIN users AS grantee ON inserted_shares.user_id = grantee.id\nJOIN services ON services.id = inserted_shares.service_id\nJOIN users AS granter ON services.user_id = granter.id"};

/**
 * Query generated from SQL:
 * ```
 * WITH inserted_shares AS (
 *     INSERT INTO shares (
 *         service_id,
 *         user_id,
 *         slug
 *     ) VALUES (
 *         :service_id,
 *         :user_id,
 *         :slug
 *     ) RETURNING *
 * )
 * SELECT 
 *     inserted_shares.*,
 *     grantee.email AS grantee_email,
 *     granter.email AS granter_email
 * FROM inserted_shares
 * JOIN users AS grantee ON inserted_shares.user_id = grantee.id
 * JOIN services ON services.id = inserted_shares.service_id
 * JOIN users AS granter ON services.user_id = granter.id
 * ```
 */
export const insertShare = new PreparedQuery<IInsertShareParams,IInsertShareResult>(insertShareIR);


/** 'SelectSharesByUserId' parameters type */
export interface ISelectSharesByUserIdParams {
  user_id?: string | null | void;
}

/** 'SelectSharesByUserId' return type */
export interface ISelectSharesByUserIdResult {
  grantee_email: string;
  granter_email: string;
  id: string;
  service_id: string;
  slug: string;
  user_id: string;
}

/** 'SelectSharesByUserId' query type */
export interface ISelectSharesByUserIdQuery {
  params: ISelectSharesByUserIdParams;
  result: ISelectSharesByUserIdResult;
}

const selectSharesByUserIdIR: any = {"usedParamSet":{"user_id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":285,"b":292}]}],"statement":"SELECT \n    shares.*,\n    grantee.email AS grantee_email,\n    granter.email AS granter_email\nFROM shares\nJOIN users AS grantee ON shares.user_id = grantee.id\nJOIN services ON services.id = shares.service_id\nJOIN users AS granter ON services.user_id = granter.id\nWHERE shares.user_id = :user_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *     shares.*,
 *     grantee.email AS grantee_email,
 *     granter.email AS granter_email
 * FROM shares
 * JOIN users AS grantee ON shares.user_id = grantee.id
 * JOIN services ON services.id = shares.service_id
 * JOIN users AS granter ON services.user_id = granter.id
 * WHERE shares.user_id = :user_id
 * ```
 */
export const selectSharesByUserId = new PreparedQuery<ISelectSharesByUserIdParams,ISelectSharesByUserIdResult>(selectSharesByUserIdIR);


/** 'SelectSharesByServiceId' parameters type */
export interface ISelectSharesByServiceIdParams {
  service_id?: string | null | void;
}

/** 'SelectSharesByServiceId' return type */
export interface ISelectSharesByServiceIdResult {
  grantee_email: string;
  granter_email: string;
  id: string;
  service_id: string;
  slug: string;
  user_id: string;
}

/** 'SelectSharesByServiceId' query type */
export interface ISelectSharesByServiceIdQuery {
  params: ISelectSharesByServiceIdParams;
  result: ISelectSharesByServiceIdResult;
}

const selectSharesByServiceIdIR: any = {"usedParamSet":{"service_id":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":281,"b":291}]}],"statement":"SELECT \n    shares.*,\n    grantee.email AS grantee_email,\n    granter.email AS granter_email\nFROM shares\nJOIN users AS grantee ON shares.user_id = grantee.id\nJOIN services ON services.id = shares.service_id\nJOIN users AS granter ON services.user_id = granter.id\nWHERE service_id = :service_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *     shares.*,
 *     grantee.email AS grantee_email,
 *     granter.email AS granter_email
 * FROM shares
 * JOIN users AS grantee ON shares.user_id = grantee.id
 * JOIN services ON services.id = shares.service_id
 * JOIN users AS granter ON services.user_id = granter.id
 * WHERE service_id = :service_id
 * ```
 */
export const selectSharesByServiceId = new PreparedQuery<ISelectSharesByServiceIdParams,ISelectSharesByServiceIdResult>(selectSharesByServiceIdIR);


/** 'DeleteSharesByServiceIdButNotOwner' parameters type */
export interface IDeleteSharesByServiceIdButNotOwnerParams {
  owner_user_id?: string | null | void;
  service_id?: string | null | void;
}

/** 'DeleteSharesByServiceIdButNotOwner' return type */
export interface IDeleteSharesByServiceIdButNotOwnerResult {
  id: string;
  service_id: string;
  slug: string;
  user_id: string;
}

/** 'DeleteSharesByServiceIdButNotOwner' query type */
export interface IDeleteSharesByServiceIdButNotOwnerQuery {
  params: IDeleteSharesByServiceIdButNotOwnerParams;
  result: IDeleteSharesByServiceIdButNotOwnerResult;
}

const deleteSharesByServiceIdButNotOwnerIR: any = {"usedParamSet":{"service_id":true,"owner_user_id":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":38,"b":48}]},{"name":"owner_user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":65,"b":78}]}],"statement":"DELETE FROM shares\nWHERE service_id = :service_id AND user_id != :owner_user_id\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM shares
 * WHERE service_id = :service_id AND user_id != :owner_user_id
 * RETURNING *
 * ```
 */
export const deleteSharesByServiceIdButNotOwner = new PreparedQuery<IDeleteSharesByServiceIdButNotOwnerParams,IDeleteSharesByServiceIdButNotOwnerResult>(deleteSharesByServiceIdButNotOwnerIR);


/** 'DeleteShareBySlug' parameters type */
export interface IDeleteShareBySlugParams {
  slug?: string | null | void;
}

/** 'DeleteShareBySlug' return type */
export interface IDeleteShareBySlugResult {
  id: string;
  service_id: string;
  slug: string;
  user_id: string;
}

/** 'DeleteShareBySlug' query type */
export interface IDeleteShareBySlugQuery {
  params: IDeleteShareBySlugParams;
  result: IDeleteShareBySlugResult;
}

const deleteShareBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":32,"b":36}]}],"statement":"DELETE FROM shares\nWHERE slug = :slug\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM shares
 * WHERE slug = :slug
 * RETURNING *
 * ```
 */
export const deleteShareBySlug = new PreparedQuery<IDeleteShareBySlugParams,IDeleteShareBySlugResult>(deleteShareBySlugIR);


