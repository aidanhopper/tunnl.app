/** Types generated for queries found in "src/db/sql/tunnel_bindings.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** Query 'InsertTunnelBinding' is invalid, so its result is assigned type 'never'.
 *  */
export type IInsertTunnelBindingResult = never;

/** Query 'InsertTunnelBinding' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IInsertTunnelBindingParams = never;

const insertTunnelBindingIR: any = {"usedParamSet":{"service_id":true,"host_id":true,"intercept_id":true,"dial_policy_id":true,"bind_policy_id":true,"share_automatically":true,"slug":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":150,"b":160}]},{"name":"host_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":165,"b":172}]},{"name":"intercept_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":177,"b":189}]},{"name":"dial_policy_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":194,"b":208}]},{"name":"bind_policy_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":213,"b":227}]},{"name":"share_automatically","required":false,"transform":{"type":"scalar"},"locs":[{"a":232,"b":251}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":256,"b":260}]}],"statement":"INSERT INTO tunnel_bindings (\n  service_id,\n  host_id,\n  intercept_id,\n  dial_policy_id,\n  bind_policy_id,\n  share_automatically,\n  slug\n) VALUES (\n  :service_id,\n  :host_id,\n  :intercept_id,\n  :dial_policy_id,\n  :bind_policy_id,\n  :share_automatically,\n  :slug\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO tunnel_bindings (
 *   service_id,
 *   host_id,
 *   intercept_id,
 *   dial_policy_id,
 *   bind_policy_id,
 *   share_automatically,
 *   slug
 * ) VALUES (
 *   :service_id,
 *   :host_id,
 *   :intercept_id,
 *   :dial_policy_id,
 *   :bind_policy_id,
 *   :share_automatically,
 *   :slug
 * )
 * RETURNING *
 * ```
 */
export const insertTunnelBinding = new PreparedQuery<IInsertTunnelBindingParams,IInsertTunnelBindingResult>(insertTunnelBindingIR);


/** Query 'GetTunnelBindingsByServiceSlug' is invalid, so its result is assigned type 'never'.
 *  */
export type IGetTunnelBindingsByServiceSlugResult = never;

/** Query 'GetTunnelBindingsByServiceSlug' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IGetTunnelBindingsByServiceSlugParams = never;

const getTunnelBindingsByServiceSlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":1870,"b":1874}]}],"statement":"SELECT \n  tunnel_bindings.*,\n  users.id AS user_id,\n  users.email AS user_email,\n  -- ziti_hosts.id AS host_id,\n  ziti_hosts.name AS host_name,\n  ziti_hosts.forward_ports AS host_forward_ports,\n  ziti_hosts.protocol AS host_protocol,\n  ziti_hosts.ziti_id AS host_ziti_id,\n  ziti_hosts.address AS host_address,\n  ziti_hosts.forward_protocol AS host_forward_protocol,\n  ziti_hosts.allowed_port_ranges AS host_allowed_port_ranges,\n  ziti_hosts.port AS host_port,\n\n  -- ziti_intercepts.id AS intercept_id,\n  ziti_intercepts.ziti_id AS intercept_ziti_id,\n  ziti_intercepts.name AS intercept_name,\n  ziti_intercepts.port_ranges AS intercept_port_ranges,\n  ziti_intercepts.protocol AS intercept_protocol,\n  ziti_intercepts.addresses AS intercept_addresses,\n\n  -- dial_policy.id AS dial_policy_id_full,\n  dial_policy.name AS dial_policy_name,\n  dial_policy.ziti_id AS dial_policy_ziti_id,\n  dial_policy.type AS dial_policy_type,\n  dial_policy.semantic AS dial_policy_semantic,\n  dial_policy.service_roles AS dial_policy_service_roles,\n  dial_policy.identity_roles AS dial_policy_identity_roles,\n\n  -- bind_policy.id AS bind_policy_id_full,\n  bind_policy.name AS bind_policy_name,\n  bind_policy.ziti_id AS bind_policy_ziti_id,\n  bind_policy.type AS bind_policy_type,\n  bind_policy.semantic AS bind_policy_semantic,\n  bind_policy.service_roles AS bind_policy_service_roles,\n  bind_policy.identity_roles AS bind_policy_identity_roles\n\nFROM tunnel_bindings\nJOIN services ON services.id = tunnel_bindings.service_id\nJOIN users ON users.id = services.user_id\nJOIN ziti_hosts ON ziti_hosts.id = tunnel_bindings.host_id\nJOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id\nJOIN ziti_policies AS dial_policy ON dial_policy.id = tunnel_bindings.dial_policy_id\nJOIN ziti_policies AS bind_policy ON bind_policy.id = tunnel_bindings.bind_policy_id\nWHERE services.slug = :slug"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *   tunnel_bindings.*,
 *   users.id AS user_id,
 *   users.email AS user_email,
 *   -- ziti_hosts.id AS host_id,
 *   ziti_hosts.name AS host_name,
 *   ziti_hosts.forward_ports AS host_forward_ports,
 *   ziti_hosts.protocol AS host_protocol,
 *   ziti_hosts.ziti_id AS host_ziti_id,
 *   ziti_hosts.address AS host_address,
 *   ziti_hosts.forward_protocol AS host_forward_protocol,
 *   ziti_hosts.allowed_port_ranges AS host_allowed_port_ranges,
 *   ziti_hosts.port AS host_port,
 * 
 *   -- ziti_intercepts.id AS intercept_id,
 *   ziti_intercepts.ziti_id AS intercept_ziti_id,
 *   ziti_intercepts.name AS intercept_name,
 *   ziti_intercepts.port_ranges AS intercept_port_ranges,
 *   ziti_intercepts.protocol AS intercept_protocol,
 *   ziti_intercepts.addresses AS intercept_addresses,
 * 
 *   -- dial_policy.id AS dial_policy_id_full,
 *   dial_policy.name AS dial_policy_name,
 *   dial_policy.ziti_id AS dial_policy_ziti_id,
 *   dial_policy.type AS dial_policy_type,
 *   dial_policy.semantic AS dial_policy_semantic,
 *   dial_policy.service_roles AS dial_policy_service_roles,
 *   dial_policy.identity_roles AS dial_policy_identity_roles,
 * 
 *   -- bind_policy.id AS bind_policy_id_full,
 *   bind_policy.name AS bind_policy_name,
 *   bind_policy.ziti_id AS bind_policy_ziti_id,
 *   bind_policy.type AS bind_policy_type,
 *   bind_policy.semantic AS bind_policy_semantic,
 *   bind_policy.service_roles AS bind_policy_service_roles,
 *   bind_policy.identity_roles AS bind_policy_identity_roles
 * 
 * FROM tunnel_bindings
 * JOIN services ON services.id = tunnel_bindings.service_id
 * JOIN users ON users.id = services.user_id
 * JOIN ziti_hosts ON ziti_hosts.id = tunnel_bindings.host_id
 * JOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id
 * JOIN ziti_policies AS dial_policy ON dial_policy.id = tunnel_bindings.dial_policy_id
 * JOIN ziti_policies AS bind_policy ON bind_policy.id = tunnel_bindings.bind_policy_id
 * WHERE services.slug = :slug
 * ```
 */
export const getTunnelBindingsByServiceSlug = new PreparedQuery<IGetTunnelBindingsByServiceSlugParams,IGetTunnelBindingsByServiceSlugResult>(getTunnelBindingsByServiceSlugIR);


/** Query 'GetTunnelBinding' is invalid, so its result is assigned type 'never'.
 *  */
export type IGetTunnelBindingResult = never;

/** Query 'GetTunnelBinding' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IGetTunnelBindingParams = never;

const getTunnelBindingIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":1898,"b":1900}]}],"statement":"SELECT \n  tunnel_bindings.*,\n  users.id AS user_id,\n  users.email AS user_email,\n  -- ziti_hosts.id AS host_id,\n  ziti_hosts.name AS host_name,\n  ziti_hosts.forward_ports AS host_forward_ports,\n  ziti_hosts.protocol AS host_protocol,\n  ziti_hosts.ziti_id AS host_ziti_id,\n  ziti_hosts.address AS host_address,\n  ziti_hosts.forward_protocol AS host_forward_protocol,\n  ziti_hosts.allowed_port_ranges AS host_allowed_port_ranges,\n  ziti_hosts.port AS host_port,\n\n  -- ziti_intercepts.id AS intercept_id,\n  ziti_intercepts.ziti_id AS intercept_ziti_id,\n  ziti_intercepts.name AS intercept_name,\n  ziti_intercepts.port_ranges AS intercept_port_ranges,\n  ziti_intercepts.protocol AS intercept_protocol,\n  ziti_intercepts.addresses AS intercept_addresses,\n\n  -- dial_policy.id AS dial_policy_id,\n  dial_policy.name AS dial_policy_name,\n  dial_policy.ziti_id AS dial_policy_ziti_id,\n  dial_policy.type AS dial_policy_type,\n  dial_policy.semantic AS dial_policy_semantic,\n  dial_policy.service_roles AS dial_policy_service_roles,\n  dial_policy.identity_roles AS dial_policy_identity_roles,\n\n  -- bind_policy.id AS bind_policy_id,\n  bind_policy.name AS bind_policy_name,\n  bind_policy.ziti_id AS bind_policy_ziti_id,\n  bind_policy.type AS bind_policy_type,\n  bind_policy.semantic AS bind_policy_semantic,\n  bind_policy.service_roles AS bind_policy_service_roles,\n  bind_policy.identity_roles AS bind_policy_identity_roles,\n  services.slug AS service_slug\n\nFROM tunnel_bindings\nJOIN services ON services.id = tunnel_bindings.service_id\nJOIN users ON users.id = services.user_id\nJOIN ziti_hosts ON ziti_hosts.id = tunnel_bindings.host_id\nJOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id\nJOIN ziti_policies AS dial_policy ON dial_policy.id = tunnel_bindings.dial_policy_id\nJOIN ziti_policies AS bind_policy ON bind_policy.id = tunnel_bindings.bind_policy_id\nWHERE tunnel_bindings.id = :id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *   tunnel_bindings.*,
 *   users.id AS user_id,
 *   users.email AS user_email,
 *   -- ziti_hosts.id AS host_id,
 *   ziti_hosts.name AS host_name,
 *   ziti_hosts.forward_ports AS host_forward_ports,
 *   ziti_hosts.protocol AS host_protocol,
 *   ziti_hosts.ziti_id AS host_ziti_id,
 *   ziti_hosts.address AS host_address,
 *   ziti_hosts.forward_protocol AS host_forward_protocol,
 *   ziti_hosts.allowed_port_ranges AS host_allowed_port_ranges,
 *   ziti_hosts.port AS host_port,
 * 
 *   -- ziti_intercepts.id AS intercept_id,
 *   ziti_intercepts.ziti_id AS intercept_ziti_id,
 *   ziti_intercepts.name AS intercept_name,
 *   ziti_intercepts.port_ranges AS intercept_port_ranges,
 *   ziti_intercepts.protocol AS intercept_protocol,
 *   ziti_intercepts.addresses AS intercept_addresses,
 * 
 *   -- dial_policy.id AS dial_policy_id,
 *   dial_policy.name AS dial_policy_name,
 *   dial_policy.ziti_id AS dial_policy_ziti_id,
 *   dial_policy.type AS dial_policy_type,
 *   dial_policy.semantic AS dial_policy_semantic,
 *   dial_policy.service_roles AS dial_policy_service_roles,
 *   dial_policy.identity_roles AS dial_policy_identity_roles,
 * 
 *   -- bind_policy.id AS bind_policy_id,
 *   bind_policy.name AS bind_policy_name,
 *   bind_policy.ziti_id AS bind_policy_ziti_id,
 *   bind_policy.type AS bind_policy_type,
 *   bind_policy.semantic AS bind_policy_semantic,
 *   bind_policy.service_roles AS bind_policy_service_roles,
 *   bind_policy.identity_roles AS bind_policy_identity_roles,
 *   services.slug AS service_slug
 * 
 * FROM tunnel_bindings
 * JOIN services ON services.id = tunnel_bindings.service_id
 * JOIN users ON users.id = services.user_id
 * JOIN ziti_hosts ON ziti_hosts.id = tunnel_bindings.host_id
 * JOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id
 * JOIN ziti_policies AS dial_policy ON dial_policy.id = tunnel_bindings.dial_policy_id
 * JOIN ziti_policies AS bind_policy ON bind_policy.id = tunnel_bindings.bind_policy_id
 * WHERE tunnel_bindings.id = :id
 * ```
 */
export const getTunnelBinding = new PreparedQuery<IGetTunnelBindingParams,IGetTunnelBindingResult>(getTunnelBindingIR);


/** 'DeleteTunnelBinding' parameters type */
export interface IDeleteTunnelBindingParams {
  id?: string | null | void;
}

/** 'DeleteTunnelBinding' return type */
export interface IDeleteTunnelBindingResult {
  created: Date;
  entry_point: boolean;
  id: string;
  service_id: string;
  slug: string;
  ziti_bind_id: string;
  ziti_dial_id: string;
  ziti_host_id: string;
  ziti_intercept_id: string;
}

/** 'DeleteTunnelBinding' query type */
export interface IDeleteTunnelBindingQuery {
  params: IDeleteTunnelBindingParams;
  result: IDeleteTunnelBindingResult;
}

const deleteTunnelBindingIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":39,"b":41}]}],"statement":"DELETE FROM tunnel_bindings WHERE id = :id RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM tunnel_bindings WHERE id = :id RETURNING *
 * ```
 */
export const deleteTunnelBinding = new PreparedQuery<IDeleteTunnelBindingParams,IDeleteTunnelBindingResult>(deleteTunnelBindingIR);


/** Query 'GetAutomaticallySharedTunnelBindingSlugsByEmail' is invalid, so its result is assigned type 'never'.
 *  */
export type IGetAutomaticallySharedTunnelBindingSlugsByEmailResult = never;

/** Query 'GetAutomaticallySharedTunnelBindingSlugsByEmail' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IGetAutomaticallySharedTunnelBindingSlugsByEmailParams = never;

const getAutomaticallySharedTunnelBindingSlugsByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":93,"b":98}]}],"statement":"SELECT slug \nFROM services\nWHERE user_id IN (\n    SELECT id\n    FROM users\n    WHERE email = :email\n) AND id IN (\n    SELECT service_id\n    FROM tunnel_bindings\n    WHERE share_automatically = true\n)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT slug 
 * FROM services
 * WHERE user_id IN (
 *     SELECT id
 *     FROM users
 *     WHERE email = :email
 * ) AND id IN (
 *     SELECT service_id
 *     FROM tunnel_bindings
 *     WHERE share_automatically = true
 * )
 * ```
 */
export const getAutomaticallySharedTunnelBindingSlugsByEmail = new PreparedQuery<IGetAutomaticallySharedTunnelBindingSlugsByEmailParams,IGetAutomaticallySharedTunnelBindingSlugsByEmailResult>(getAutomaticallySharedTunnelBindingSlugsByEmailIR);


/** Query 'GetAutomaticallySharedTunnelBindings' is invalid, so its result is assigned type 'never'.
 *  */
export type IGetAutomaticallySharedTunnelBindingsResult = never;

/** Query 'GetAutomaticallySharedTunnelBindings' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IGetAutomaticallySharedTunnelBindingsParams = never;

const getAutomaticallySharedTunnelBindingsIR: any = {"usedParamSet":{"user_id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":52,"b":59}]}],"statement":"SELECT slug \nFROM services\nWHERE services.user_id = :user_id\nAND services.id IN (\n    SELECT service_id\n    FROM tunnel_bindings\n    WHERE share_automatically = true\n) AND services.enabled = true"};

/**
 * Query generated from SQL:
 * ```
 * SELECT slug 
 * FROM services
 * WHERE services.user_id = :user_id
 * AND services.id IN (
 *     SELECT service_id
 *     FROM tunnel_bindings
 *     WHERE share_automatically = true
 * ) AND services.enabled = true
 * ```
 */
export const getAutomaticallySharedTunnelBindings = new PreparedQuery<IGetAutomaticallySharedTunnelBindingsParams,IGetAutomaticallySharedTunnelBindingsResult>(getAutomaticallySharedTunnelBindingsIR);


/** Query 'GetTunnelBindingBySlug' is invalid, so its result is assigned type 'never'.
 *  */
export type IGetTunnelBindingBySlugResult = never;

/** Query 'GetTunnelBindingBySlug' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IGetTunnelBindingBySlugParams = never;

const getTunnelBindingBySlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":1867,"b":1871}]}],"statement":"SELECT \n  tunnel_bindings.*,\n  users.id AS user_id,\n  users.email AS user_email,\n  -- ziti_hosts.id AS host_id,\n  ziti_hosts.name AS host_name,\n  ziti_hosts.forward_ports AS host_forward_ports,\n  ziti_hosts.protocol AS host_protocol,\n  ziti_hosts.ziti_id AS host_ziti_id,\n  ziti_hosts.address AS host_address,\n  ziti_hosts.forward_protocol AS host_forward_protocol,\n  ziti_hosts.allowed_port_ranges AS host_allowed_port_ranges,\n  ziti_hosts.port AS host_port,\n\n  -- ziti_intercepts.id AS intercept_id,\n  ziti_intercepts.ziti_id AS intercept_ziti_id,\n  ziti_intercepts.name AS intercept_name,\n  ziti_intercepts.port_ranges AS intercept_port_ranges,\n  ziti_intercepts.protocol AS intercept_protocol,\n  ziti_intercepts.addresses AS intercept_addresses,\n\n  -- dial_policy.id AS dial_policy_id,\n  dial_policy.name AS dial_policy_name,\n  dial_policy.ziti_id AS dial_policy_ziti_id,\n  dial_policy.type AS dial_policy_type,\n  dial_policy.semantic AS dial_policy_semantic,\n  dial_policy.service_roles AS dial_policy_service_roles,\n  dial_policy.identity_roles AS dial_policy_identity_roles,\n\n  -- bind_policy.id AS bind_policy_id,\n  bind_policy.name AS bind_policy_name,\n  bind_policy.ziti_id AS bind_policy_ziti_id,\n  bind_policy.type AS bind_policy_type,\n  bind_policy.semantic AS bind_policy_semantic,\n  bind_policy.service_roles AS bind_policy_service_roles,\n  bind_policy.identity_roles AS bind_policy_identity_roles\n\nFROM tunnel_bindings\nJOIN services ON services.id = tunnel_bindings.service_id\nJOIN users ON users.id = services.user_id\nJOIN ziti_hosts ON ziti_hosts.id = tunnel_bindings.host_id\nJOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id\nJOIN ziti_policies AS dial_policy ON dial_policy.id = tunnel_bindings.dial_policy_id\nJOIN ziti_policies AS bind_policy ON bind_policy.id = tunnel_bindings.bind_policy_id\nWHERE tunnel_bindings.slug = :slug"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *   tunnel_bindings.*,
 *   users.id AS user_id,
 *   users.email AS user_email,
 *   -- ziti_hosts.id AS host_id,
 *   ziti_hosts.name AS host_name,
 *   ziti_hosts.forward_ports AS host_forward_ports,
 *   ziti_hosts.protocol AS host_protocol,
 *   ziti_hosts.ziti_id AS host_ziti_id,
 *   ziti_hosts.address AS host_address,
 *   ziti_hosts.forward_protocol AS host_forward_protocol,
 *   ziti_hosts.allowed_port_ranges AS host_allowed_port_ranges,
 *   ziti_hosts.port AS host_port,
 * 
 *   -- ziti_intercepts.id AS intercept_id,
 *   ziti_intercepts.ziti_id AS intercept_ziti_id,
 *   ziti_intercepts.name AS intercept_name,
 *   ziti_intercepts.port_ranges AS intercept_port_ranges,
 *   ziti_intercepts.protocol AS intercept_protocol,
 *   ziti_intercepts.addresses AS intercept_addresses,
 * 
 *   -- dial_policy.id AS dial_policy_id,
 *   dial_policy.name AS dial_policy_name,
 *   dial_policy.ziti_id AS dial_policy_ziti_id,
 *   dial_policy.type AS dial_policy_type,
 *   dial_policy.semantic AS dial_policy_semantic,
 *   dial_policy.service_roles AS dial_policy_service_roles,
 *   dial_policy.identity_roles AS dial_policy_identity_roles,
 * 
 *   -- bind_policy.id AS bind_policy_id,
 *   bind_policy.name AS bind_policy_name,
 *   bind_policy.ziti_id AS bind_policy_ziti_id,
 *   bind_policy.type AS bind_policy_type,
 *   bind_policy.semantic AS bind_policy_semantic,
 *   bind_policy.service_roles AS bind_policy_service_roles,
 *   bind_policy.identity_roles AS bind_policy_identity_roles
 * 
 * FROM tunnel_bindings
 * JOIN services ON services.id = tunnel_bindings.service_id
 * JOIN users ON users.id = services.user_id
 * JOIN ziti_hosts ON ziti_hosts.id = tunnel_bindings.host_id
 * JOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id
 * JOIN ziti_policies AS dial_policy ON dial_policy.id = tunnel_bindings.dial_policy_id
 * JOIN ziti_policies AS bind_policy ON bind_policy.id = tunnel_bindings.bind_policy_id
 * WHERE tunnel_bindings.slug = :slug
 * ```
 */
export const getTunnelBindingBySlug = new PreparedQuery<IGetTunnelBindingBySlugParams,IGetTunnelBindingBySlugResult>(getTunnelBindingBySlugIR);


