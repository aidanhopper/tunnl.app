/** Types generated for queries found in "src/db/sql/services.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type protocol = 'http' | 'tcp' | 'tcp/udp' | 'udp';

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


/** 'EnableServiceBySlug' parameters type */
export interface IEnableServiceBySlugParams {
  slug?: string | null | void;
}

/** 'EnableServiceBySlug' return type */
export interface IEnableServiceBySlugResult {
  created: Date;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
}

/** 'EnableServiceBySlug' query type */
export interface IEnableServiceBySlugQuery {
  params: IEnableServiceBySlugParams;
  result: IEnableServiceBySlugResult;
}

const enableServiceBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":48,"b":52}]}],"statement":"UPDATE services\nSET enabled = TRUE\nWHERE slug = :slug\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE services
 * SET enabled = TRUE
 * WHERE slug = :slug
 * RETURNING *
 * ```
 */
export const enableServiceBySlug = new PreparedQuery<IEnableServiceBySlugParams,IEnableServiceBySlugResult>(enableServiceBySlugIR);


/** 'DisableServiceBySlug' parameters type */
export interface IDisableServiceBySlugParams {
  slug?: string | null | void;
}

/** 'DisableServiceBySlug' return type */
export interface IDisableServiceBySlugResult {
  created: Date;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
}

/** 'DisableServiceBySlug' query type */
export interface IDisableServiceBySlugQuery {
  params: IDisableServiceBySlugParams;
  result: IDisableServiceBySlugResult;
}

const disableServiceBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":49,"b":53}]}],"statement":"UPDATE services\nSET enabled = FALSE\nWHERE slug = :slug\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE services
 * SET enabled = FALSE
 * WHERE slug = :slug
 * RETURNING *
 * ```
 */
export const disableServiceBySlug = new PreparedQuery<IDisableServiceBySlugParams,IDisableServiceBySlugResult>(disableServiceBySlugIR);


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


/** 'SelectServiceById' parameters type */
export interface ISelectServiceByIdParams {
  id?: string | null | void;
}

/** 'SelectServiceById' return type */
export interface ISelectServiceByIdResult {
  created: Date;
  enabled: boolean;
  id: string;
  name: string;
  protocol: protocol;
  slug: string;
  user_id: string;
}

/** 'SelectServiceById' query type */
export interface ISelectServiceByIdQuery {
  params: ISelectServiceByIdParams;
  result: ISelectServiceByIdResult;
}

const selectServiceByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":34,"b":36}]}],"statement":"SELECT *\nFROM services\nWHERE id = :id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM services
 * WHERE id = :id
 * ```
 */
export const selectServiceById = new PreparedQuery<ISelectServiceByIdParams,ISelectServiceByIdResult>(selectServiceByIdIR);


