/** Types generated for queries found in "src/db/sql/tunnel_bindings.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type policy_semantic = 'AllOf' | 'AnyOf';

export type policy_type = 'Bind' | 'Dial';

export type protocol = 'http' | 'tcp' | 'tcp/udp' | 'udp';

export type stringArray = (string)[];

/** 'InsertTunnelBinding' parameters type */
export interface IInsertTunnelBindingParams {
  bind_policy_id?: string | null | void;
  dial_policy_id?: string | null | void;
  host_id?: string | null | void;
  intercept_id?: string | null | void;
  service_id?: string | null | void;
  share_automatically?: boolean | null | void;
}

/** 'InsertTunnelBinding' return type */
export interface IInsertTunnelBindingResult {
  bind_policy_id: string;
  dial_policy_id: string;
  host_id: string;
  id: string;
  intercept_id: string;
  service_id: string;
  share_automatically: boolean;
}

/** 'InsertTunnelBinding' query type */
export interface IInsertTunnelBindingQuery {
  params: IInsertTunnelBindingParams;
  result: IInsertTunnelBindingResult;
}

const insertTunnelBindingIR: any = {"usedParamSet":{"service_id":true,"host_id":true,"intercept_id":true,"dial_policy_id":true,"bind_policy_id":true,"share_automatically":true},"params":[{"name":"service_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":144,"b":154}]},{"name":"host_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":159,"b":166}]},{"name":"intercept_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":171,"b":183}]},{"name":"dial_policy_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":188,"b":202}]},{"name":"bind_policy_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":207,"b":221}]},{"name":"share_automatically","required":false,"transform":{"type":"scalar"},"locs":[{"a":226,"b":245}]}],"statement":"INSERT INTO tunnel_bindings (\n  service_id,\n  host_id,\n  intercept_id,\n  dial_policy_id,\n  bind_policy_id,\n  share_automatically  \n) VALUES (\n  :service_id,\n  :host_id,\n  :intercept_id,\n  :dial_policy_id,\n  :bind_policy_id,\n  :share_automatically\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO tunnel_bindings (
 *   service_id,
 *   host_id,
 *   intercept_id,
 *   dial_policy_id,
 *   bind_policy_id,
 *   share_automatically  
 * ) VALUES (
 *   :service_id,
 *   :host_id,
 *   :intercept_id,
 *   :dial_policy_id,
 *   :bind_policy_id,
 *   :share_automatically
 * )
 * RETURNING *
 * ```
 */
export const insertTunnelBinding = new PreparedQuery<IInsertTunnelBindingParams,IInsertTunnelBindingResult>(insertTunnelBindingIR);


/** 'GetTunnelBindingsByServiceSlug' parameters type */
export interface IGetTunnelBindingsByServiceSlugParams {
  slug?: string | null | void;
}

/** 'GetTunnelBindingsByServiceSlug' return type */
export interface IGetTunnelBindingsByServiceSlugResult {
  bind_policy_id: string;
  bind_policy_id_full: string;
  bind_policy_identity_roles: stringArray;
  bind_policy_name: string;
  bind_policy_semantic: policy_semantic;
  bind_policy_service_roles: stringArray;
  bind_policy_type: policy_type;
  bind_policy_ziti_id: string;
  dial_policy_id: string;
  dial_policy_id_full: string;
  dial_policy_identity_roles: stringArray;
  dial_policy_name: string;
  dial_policy_semantic: policy_semantic;
  dial_policy_service_roles: stringArray;
  dial_policy_type: policy_type;
  dial_policy_ziti_id: string;
  host_address: string;
  host_allowed_port_ranges: string | null;
  host_forward_ports: boolean;
  host_forward_protocol: boolean;
  host_id: string;
  host_id: string;
  host_name: string;
  host_port: string | null;
  host_protocol: protocol | null;
  host_ziti_id: string;
  id: string;
  intercept_addresses: stringArray;
  intercept_id: string;
  intercept_id: string;
  intercept_name: string;
  intercept_port_ranges: string;
  intercept_protocol: protocol;
  intercept_ziti_id: string;
  service_id: string;
  share_automatically: boolean;
}

/** 'GetTunnelBindingsByServiceSlug' query type */
export interface IGetTunnelBindingsByServiceSlugQuery {
  params: IGetTunnelBindingsByServiceSlugParams;
  result: IGetTunnelBindingsByServiceSlugResult;
}

const getTunnelBindingsByServiceSlugIR: any = {"usedParamSet":{"slug":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":1764,"b":1768}]}],"statement":"SELECT \n  tunnel_bindings.*,\n  ziti_hosts.id AS host_id,\n  ziti_hosts.name AS host_name,\n  ziti_hosts.forward_ports AS host_forward_ports,\n  ziti_hosts.protocol AS host_protocol,\n  ziti_hosts.ziti_id AS host_ziti_id,\n  ziti_hosts.address AS host_address,\n  ziti_hosts.forward_protocol AS host_forward_protocol,\n  ziti_hosts.allowed_port_ranges AS host_allowed_port_ranges,\n  ziti_hosts.port AS host_port,\n\n  ziti_intercepts.id AS intercept_id,\n  ziti_intercepts.ziti_id AS intercept_ziti_id,\n  ziti_intercepts.name AS intercept_name,\n  ziti_intercepts.port_ranges AS intercept_port_ranges,\n  ziti_intercepts.protocol AS intercept_protocol,\n  ziti_intercepts.addresses AS intercept_addresses,\n\n  dial_policy.id AS dial_policy_id_full,\n  dial_policy.name AS dial_policy_name,\n  dial_policy.ziti_id AS dial_policy_ziti_id,\n  dial_policy.type AS dial_policy_type,\n  dial_policy.semantic AS dial_policy_semantic,\n  dial_policy.service_roles AS dial_policy_service_roles,\n  dial_policy.identity_roles AS dial_policy_identity_roles,\n\n  bind_policy.id AS bind_policy_id_full,\n  bind_policy.name AS bind_policy_name,\n  bind_policy.ziti_id AS bind_policy_ziti_id,\n  bind_policy.type AS bind_policy_type,\n  bind_policy.semantic AS bind_policy_semantic,\n  bind_policy.service_roles AS bind_policy_service_roles,\n  bind_policy.identity_roles AS bind_policy_identity_roles\n\nFROM tunnel_bindings\nJOIN services ON services.id = tunnel_bindings.service_id\nJOIN ziti_hosts ON ziti_hosts.id = tunnel_bindings.host_id\nJOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id\nJOIN ziti_policies AS dial_policy ON dial_policy.id = tunnel_bindings.dial_policy_id\nJOIN ziti_policies AS bind_policy ON bind_policy.id = tunnel_bindings.bind_policy_id\nWHERE services.slug = :slug"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *   tunnel_bindings.*,
 *   ziti_hosts.id AS host_id,
 *   ziti_hosts.name AS host_name,
 *   ziti_hosts.forward_ports AS host_forward_ports,
 *   ziti_hosts.protocol AS host_protocol,
 *   ziti_hosts.ziti_id AS host_ziti_id,
 *   ziti_hosts.address AS host_address,
 *   ziti_hosts.forward_protocol AS host_forward_protocol,
 *   ziti_hosts.allowed_port_ranges AS host_allowed_port_ranges,
 *   ziti_hosts.port AS host_port,
 * 
 *   ziti_intercepts.id AS intercept_id,
 *   ziti_intercepts.ziti_id AS intercept_ziti_id,
 *   ziti_intercepts.name AS intercept_name,
 *   ziti_intercepts.port_ranges AS intercept_port_ranges,
 *   ziti_intercepts.protocol AS intercept_protocol,
 *   ziti_intercepts.addresses AS intercept_addresses,
 * 
 *   dial_policy.id AS dial_policy_id_full,
 *   dial_policy.name AS dial_policy_name,
 *   dial_policy.ziti_id AS dial_policy_ziti_id,
 *   dial_policy.type AS dial_policy_type,
 *   dial_policy.semantic AS dial_policy_semantic,
 *   dial_policy.service_roles AS dial_policy_service_roles,
 *   dial_policy.identity_roles AS dial_policy_identity_roles,
 * 
 *   bind_policy.id AS bind_policy_id_full,
 *   bind_policy.name AS bind_policy_name,
 *   bind_policy.ziti_id AS bind_policy_ziti_id,
 *   bind_policy.type AS bind_policy_type,
 *   bind_policy.semantic AS bind_policy_semantic,
 *   bind_policy.service_roles AS bind_policy_service_roles,
 *   bind_policy.identity_roles AS bind_policy_identity_roles
 * 
 * FROM tunnel_bindings
 * JOIN services ON services.id = tunnel_bindings.service_id
 * JOIN ziti_hosts ON ziti_hosts.id = tunnel_bindings.host_id
 * JOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id
 * JOIN ziti_policies AS dial_policy ON dial_policy.id = tunnel_bindings.dial_policy_id
 * JOIN ziti_policies AS bind_policy ON bind_policy.id = tunnel_bindings.bind_policy_id
 * WHERE services.slug = :slug
 * ```
 */
export const getTunnelBindingsByServiceSlug = new PreparedQuery<IGetTunnelBindingsByServiceSlugParams,IGetTunnelBindingsByServiceSlugResult>(getTunnelBindingsByServiceSlugIR);


/** 'GetTunnelBinding' parameters type */
export interface IGetTunnelBindingParams {
  id?: string | null | void;
}

/** 'GetTunnelBinding' return type */
export interface IGetTunnelBindingResult {
  bind_policy_id: string;
  bind_policy_id: string;
  bind_policy_identity_roles: stringArray;
  bind_policy_name: string;
  bind_policy_semantic: policy_semantic;
  bind_policy_service_roles: stringArray;
  bind_policy_type: policy_type;
  bind_policy_ziti_id: string;
  dial_policy_id: string;
  dial_policy_id: string;
  dial_policy_identity_roles: stringArray;
  dial_policy_name: string;
  dial_policy_semantic: policy_semantic;
  dial_policy_service_roles: stringArray;
  dial_policy_type: policy_type;
  dial_policy_ziti_id: string;
  host_address: string;
  host_allowed_port_ranges: string | null;
  host_forward_ports: boolean;
  host_forward_protocol: boolean;
  host_id: string;
  host_id: string;
  host_name: string;
  host_port: string | null;
  host_protocol: protocol | null;
  host_ziti_id: string;
  id: string;
  intercept_addresses: stringArray;
  intercept_id: string;
  intercept_id: string;
  intercept_name: string;
  intercept_port_ranges: string;
  intercept_protocol: protocol;
  intercept_ziti_id: string;
  service_id: string;
  share_automatically: boolean;
}

/** 'GetTunnelBinding' query type */
export interface IGetTunnelBindingQuery {
  params: IGetTunnelBindingParams;
  result: IGetTunnelBindingResult;
}

const getTunnelBindingIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":1759,"b":1761}]}],"statement":"SELECT \n  tunnel_bindings.*,\n  ziti_hosts.id AS host_id,\n  ziti_hosts.name AS host_name,\n  ziti_hosts.forward_ports AS host_forward_ports,\n  ziti_hosts.protocol AS host_protocol,\n  ziti_hosts.ziti_id AS host_ziti_id,\n  ziti_hosts.address AS host_address,\n  ziti_hosts.forward_protocol AS host_forward_protocol,\n  ziti_hosts.allowed_port_ranges AS host_allowed_port_ranges,\n  ziti_hosts.port AS host_port,\n\n  ziti_intercepts.id AS intercept_id,\n  ziti_intercepts.ziti_id AS intercept_ziti_id,\n  ziti_intercepts.name AS intercept_name,\n  ziti_intercepts.port_ranges AS intercept_port_ranges,\n  ziti_intercepts.protocol AS intercept_protocol,\n  ziti_intercepts.addresses AS intercept_addresses,\n\n  dial_policy.id AS dial_policy_id,\n  dial_policy.name AS dial_policy_name,\n  dial_policy.ziti_id AS dial_policy_ziti_id,\n  dial_policy.type AS dial_policy_type,\n  dial_policy.semantic AS dial_policy_semantic,\n  dial_policy.service_roles AS dial_policy_service_roles,\n  dial_policy.identity_roles AS dial_policy_identity_roles,\n\n  bind_policy.id AS bind_policy_id,\n  bind_policy.name AS bind_policy_name,\n  bind_policy.ziti_id AS bind_policy_ziti_id,\n  bind_policy.type AS bind_policy_type,\n  bind_policy.semantic AS bind_policy_semantic,\n  bind_policy.service_roles AS bind_policy_service_roles,\n  bind_policy.identity_roles AS bind_policy_identity_roles\n\nFROM tunnel_bindings\nJOIN services ON services.id = tunnel_bindings.service_id\nJOIN ziti_hosts ON ziti_hosts.id = tunnel_bindings.host_id\nJOIN ziti_intercepts ON ziti_intercepts.id = tunnel_bindings.intercept_id\nJOIN ziti_policies AS dial_policy ON dial_policy.id = tunnel_bindings.dial_policy_id\nJOIN ziti_policies AS bind_policy ON bind_policy.id = tunnel_bindings.bind_policy_id\nWHERE tunnel_bindings.id = :id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *   tunnel_bindings.*,
 *   ziti_hosts.id AS host_id,
 *   ziti_hosts.name AS host_name,
 *   ziti_hosts.forward_ports AS host_forward_ports,
 *   ziti_hosts.protocol AS host_protocol,
 *   ziti_hosts.ziti_id AS host_ziti_id,
 *   ziti_hosts.address AS host_address,
 *   ziti_hosts.forward_protocol AS host_forward_protocol,
 *   ziti_hosts.allowed_port_ranges AS host_allowed_port_ranges,
 *   ziti_hosts.port AS host_port,
 * 
 *   ziti_intercepts.id AS intercept_id,
 *   ziti_intercepts.ziti_id AS intercept_ziti_id,
 *   ziti_intercepts.name AS intercept_name,
 *   ziti_intercepts.port_ranges AS intercept_port_ranges,
 *   ziti_intercepts.protocol AS intercept_protocol,
 *   ziti_intercepts.addresses AS intercept_addresses,
 * 
 *   dial_policy.id AS dial_policy_id,
 *   dial_policy.name AS dial_policy_name,
 *   dial_policy.ziti_id AS dial_policy_ziti_id,
 *   dial_policy.type AS dial_policy_type,
 *   dial_policy.semantic AS dial_policy_semantic,
 *   dial_policy.service_roles AS dial_policy_service_roles,
 *   dial_policy.identity_roles AS dial_policy_identity_roles,
 * 
 *   bind_policy.id AS bind_policy_id,
 *   bind_policy.name AS bind_policy_name,
 *   bind_policy.ziti_id AS bind_policy_ziti_id,
 *   bind_policy.type AS bind_policy_type,
 *   bind_policy.semantic AS bind_policy_semantic,
 *   bind_policy.service_roles AS bind_policy_service_roles,
 *   bind_policy.identity_roles AS bind_policy_identity_roles
 * 
 * FROM tunnel_bindings
 * JOIN services ON services.id = tunnel_bindings.service_id
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
  bind_policy_id: string;
  dial_policy_id: string;
  host_id: string;
  id: string;
  intercept_id: string;
  service_id: string;
  share_automatically: boolean;
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


/** 'GetAutomaticallySharedTunnelBindingSlugsByEmail' parameters type */
export interface IGetAutomaticallySharedTunnelBindingSlugsByEmailParams {
  email?: string | null | void;
}

/** 'GetAutomaticallySharedTunnelBindingSlugsByEmail' return type */
export interface IGetAutomaticallySharedTunnelBindingSlugsByEmailResult {
  slug: string;
}

/** 'GetAutomaticallySharedTunnelBindingSlugsByEmail' query type */
export interface IGetAutomaticallySharedTunnelBindingSlugsByEmailQuery {
  params: IGetAutomaticallySharedTunnelBindingSlugsByEmailParams;
  result: IGetAutomaticallySharedTunnelBindingSlugsByEmailResult;
}

const getAutomaticallySharedTunnelBindingSlugsByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":153,"b":158}]}],"statement":"SELECT slug \nFROM services\nWHERE id = (\n    SELECT id\n    FROM services\n    WHERE user_id = (\n        SELECT id\n        FROM users\n        WHERE email = :email\n    )\n) AND id = (\n    SELECT service_id\n    FROM tunnel_bindings\n    WHERE share_automatically = true\n)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT slug 
 * FROM services
 * WHERE id = (
 *     SELECT id
 *     FROM services
 *     WHERE user_id = (
 *         SELECT id
 *         FROM users
 *         WHERE email = :email
 *     )
 * ) AND id = (
 *     SELECT service_id
 *     FROM tunnel_bindings
 *     WHERE share_automatically = true
 * )
 * ```
 */
export const getAutomaticallySharedTunnelBindingSlugsByEmail = new PreparedQuery<IGetAutomaticallySharedTunnelBindingSlugsByEmailParams,IGetAutomaticallySharedTunnelBindingSlugsByEmailResult>(getAutomaticallySharedTunnelBindingSlugsByEmailIR);


/** 'GetAutomaticallySharedTunnelBindings' parameters type */
export interface IGetAutomaticallySharedTunnelBindingsParams {
  user_id?: string | null | void;
}

/** 'GetAutomaticallySharedTunnelBindings' return type */
export interface IGetAutomaticallySharedTunnelBindingsResult {
  slug: string;
}

/** 'GetAutomaticallySharedTunnelBindings' query type */
export interface IGetAutomaticallySharedTunnelBindingsQuery {
  params: IGetAutomaticallySharedTunnelBindingsParams;
  result: IGetAutomaticallySharedTunnelBindingsResult;
}

const getAutomaticallySharedTunnelBindingsIR: any = {"usedParamSet":{"user_id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":92,"b":99}]}],"statement":"SELECT slug \nFROM services\nWHERE id = (\n    SELECT id\n    FROM services\n    WHERE user_id = :user_id\n) AND id = (\n    SELECT service_id\n    FROM tunnel_bindings\n    WHERE share_automatically = true\n)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT slug 
 * FROM services
 * WHERE id = (
 *     SELECT id
 *     FROM services
 *     WHERE user_id = :user_id
 * ) AND id = (
 *     SELECT service_id
 *     FROM tunnel_bindings
 *     WHERE share_automatically = true
 * )
 * ```
 */
export const getAutomaticallySharedTunnelBindings = new PreparedQuery<IGetAutomaticallySharedTunnelBindingsParams,IGetAutomaticallySharedTunnelBindingsResult>(getAutomaticallySharedTunnelBindingsIR);


