export interface IdentityListResponse {
    data: IdentityResponse[];
    meta: Meta;
}

export interface GetIdentityResponse {
    data: IdentityResponse;
    meta: Meta;
}

interface IdentityResponse {
    _links: Links;
    comment?: string;
    href: string;
    method?: string;
    createdAt: string;
    id: string;
    tags?: Tags | null;
    updatedAt: string;
    appData?: Tags | null;
    authPolicy: EntityRef;
    authPolicyId: string;
    authenticators: IdentityAuthenticators;
    defaultHostingCost: number; // [0 .. 65535]
    defaultHostingPrecedence: "default" | "required" | "failed";
    disabled: boolean;
    disabledAt?: string | null;
    disabledUntil?: string | null;
    edgeRouterConnectionStatus: "online" | "offline" | "unknown";
    enrollment: IdentityEnrollments;
    envInfo: EnvInfo;
    externalId: string | null;
    hasApiSession: boolean;
    hasEdgeRouterConnection: boolean;
    isAdmin: boolean;
    isDefaultAdmin: boolean;
    isMfaEnabled: boolean;
    name: string;
    roleAttributes: string[] | null;
    sdkInfo: SdkInfo;
    serviceHostingCosts: Record<string, number>; // integer (0..65535)
    serviceHostingPrecedences: Record<string, "default" | "required" | "failed">;
    type: EntityRef;
    typeId: string;
}

interface Links {
    [key: string]: Link;
}

interface Tags {
    [key: string]: string | boolean | null;
}

interface IdentityAuthenticators {
    cert?: CertAuthenticator;
    updb?: UpdbAuthenticator;
}

interface CertAuthenticator {
    fingerprint?: string;
    id?: string;
}

interface UpdbAuthenticator {
    id?: string;
    username?: string;
}

interface IdentityEnrollments {
    ott?: OttEnrollment;
    ottca?: OttcaEnrollment;
    updb?: UpdbEnrollment;
}

interface OttEnrollment {
    expiresAt?: string;
    id?: string;
    jwt?: string;
    token?: string;
}

interface OttcaEnrollment {
    ca: EntityRef;
    _links?: Links;
    comment?: string;
    href: string;
    method?: string;
    entity?: string;
    id: string;
    name: string;
    caId: string;
    expiresAt: string;
    jwt: string;
    token: string;
}

interface UpdbEnrollment {
    expiresAt: string;
    id: string;
    jwt: string;
    token: string;
}

interface EnvInfo {
    arch?: string;
    domain?: string;
    hostname?: string;
    os?: string;
    osRelease?: string;
    osVersion?: string;
}

interface SdkInfo {
    appId?: string;
    appVersion?: string;
    branch?: string;
    revision?: string;
    type?: string;
    version?: string;
}

interface Meta {
    apiEnrollmentVersion?: string;
    apiVersion?: string;
    filterableFields?: string[];
    pagination?: Pagination;
}

interface PostIdentityEnrollments {
    ott?: boolean;
    ottca?: boolean;
    updb?: boolean;
}

export interface PostIdentityData {
    appData?: Tags | null;
    authPolicyId?: string | null;
    defaultHostingCost?: number; // [0 .. 65535]
    defaultHostingPrecedence?: "default" | "required" | "failed";
    enrollment?: PostIdentityEnrollments;
    externalId?: string | null;
    isAdmin: boolean;
    name: string;
    roleAttributes?: string[] | null;
    serviceHostingCosts?: Record<string, number>; // integer (0..65535)
    serviceHostingPrecedences?: Record<string, "default" | "required" | "failed">;
    tags?: Tags | null;
    type: "User" | "Device" | "Service" | "Router" | "Default";
}

export interface PostIdentityResponse {
    data: { id: string };
    _links: Links;
    meta: Meta;
};

export interface PatchIdentityData {
    appData?: { [key: string]: string | boolean | null } | null;
    authPolicyId?: string | null;
    defaultHostingCost?: number; // integer (0 .. 65535)
    defaultHostingPrecedence?: "default" | "required" | "failed";
    externalId?: string | null;
    isAdmin?: boolean | null;
    name?: string | null;
    roleAttributes?: string[] | null;
    serviceHostingCosts?: Record<string, number>; // integer (0 .. 65535)
    serviceHostingPrecedences?: Record<string, "default" | "required" | "failed">;
    tags?: { [key: string]: string | boolean | null } | null;
    type?: "User" | "Device" | "Service" | "Router" | "Default";
}

type AppDataValue = string | boolean | null;

interface Link {
    comment?: string;
    href: string; // URI
    method?: string;
}

interface EntityRef {
    _links: Links;
    entity: string;
    id: string;
    name: string;
}

interface Enrollment {
    _links: Links;
    comment?: string;
    createdAt: string; // date-time string
    id: string;
    tags?: Record<string, AppDataValue> | null;
    updatedAt: string; // date-time string
    caId?: string | null;
    edgeRouter?: EntityRef;
    edgeRouterId?: string;
    expiresAt: string; // date-time string
    identity?: EntityRef;
    identityId?: string;
    jwt?: string;
    method: string;
    token: string;
    transitRouter?: EntityRef;
    transitRouterId?: string;
    username?: string;
}

interface Pagination {
    limit: number;
    offset: number;
    totalCount: number;
}

export interface EnrollmentListResponse {
    data: Enrollment[];
    meta: Meta;
}

export interface PostServiceData {
    name: string;
    encryptionRequired: boolean;
    maxIdleTimeMillis?: number;
    roleAttributes?: string[];
    configs?: string[];
    tags?: {
        [key: string]: string | boolean | null;
    } | null;
    terminatorStrategy?: string;
}

export interface PatchServiceData {
    name?: string;
    encryptionRequired?: boolean;
    maxIdleTimeMillis?: number;
    roleAttributes?: string[];
    configs?: string[];
    tags?: {
        [key: string]: string | boolean | null;
    } | null;
    terminatorStrategy?: string;
}

export interface ServiceListResponse {
    data: GetServiceData[];
    _links: Record<string, Link>;
    meta: Meta;
}

export interface GetServiceResponse {
    data: GetServiceData;
    _links: Record<string, Link>;
    meta: Meta;
}

export interface GetServiceData {
    id: string;
    name: string;
    encryptionRequired: boolean;
    maxIdleTimeMillis: number;
    roleAttributes: string[] | null;
    configs: string[];
    config: Record<string, object>; // map of config type -> config object
    permissions: ("Dial" | "Bind" | "Invalid")[];
    postureQueries: PostureQuery[];
    tags: Record<string, string | boolean | null> | null;
    terminatorStrategy: string;
    createdAt: string; // ISO date-time
    updatedAt: string; // ISO date-time
    _links: Record<string, Link>;
}

interface Link {
    href: string;
    comment?: string;
    method?: string;
}

interface PostureQuery {
    id: string;
    policyId: string;
    policyType?: "Dial" | "Bind" | "Invalid";
    queryType: "OS" | "PROCESS" | "DOMAIN" | "MAC" | "MFA" | "PROCESS_MULTI";
    timeout: number;
    timeoutRemaining: number;
    isPassing: boolean;
    process?: PostureQueryProcess;
    processes?: PostureQueryProcess[];
    tags?: Record<string, string | boolean | null>;
    createdAt: string;
    updatedAt: string;
    _links: Record<string, Link>;
}

interface PostureQueryProcess {
    osType: "Windows" | "WindowsServer" | "Android" | "iOS" | "Linux" | "macOS";
    path: string;
}

export interface PostConfigData {
    configTypeId: string;
    name: string;
    data: object;
    tags?: Tags | null
}

export interface PatchConfigData {
    configTypeId?: string;
    name?: string;
    data?: object;
    tags?: Tags | null;
}

export interface ConfigTypeListResponse {
    data: ConfigType[];
    _links: Links
    meta: {
        apiEnrollmentVersion: string;
        apiVersion: string;
        filterableFields: string[];
        pagination: {
            limit: number;
            offset: number;
            totalCount: number;
        };
    };
};

interface ConfigType {
    createdAt: string; // ISO date-time
    updatedAt: string; // ISO date-time
    id: string;
    name: string;
    tags?: Tags
    schema: Record<string, object>; // schema is a JSON schema object, shape is dynamic
};

export interface PostConfigResponse {
    data: { id: string };
    _links: Links;
    meta: Meta;
};

export interface PostServiceResponse {
    data: { id: string };
    _links: Links;
    meta: Meta;
};

export interface GetPolicyResponse {
    data: ServicePolicyDetail;
    _links: {
        [property: string]: Link;
    };
}

export interface ServicePolicyDetail {
    createdAt: string;
    id: string;
    tags: Record<string, string | boolean | null> | null;
    updatedAt: string;
    identityRoles: string[];
    identityRolesDisplay: NamedRole[];
    postureCheckRoles: string[];
    postureCheckRolesDisplay: NamedRole[];
    semantic: "AllOf" | "AnyOf";
    serviceRoles: string[];
    serviceRolesDisplay: NamedRole[];
    type: "Dial" | "Bind" | "Invalid";
    meta: Meta;
}

interface NamedRole {
    name: string;
    role: string;
}

export interface PostPolicyData {
    identityRoles: string[];
    name: string;
    postureCheckRoles: string[];
    semantic: "AllOf" | "AnyOf";
    serviceRoles: string[];
    tags?: Tags;
    type: "Dial" | "Bind" | "Invalid";
};

export interface PatchPolicyData {
    identityRoles?: string[];
    name?: string;
    postureCheckRoles?: string[];
    semantic?: "AllOf" | "AnyOf";
    serviceRoles?: string[];
    tags?: Tags;
    type?: "Dial" | "Bind" | "Invalid";
}

export interface PostPolicyResponse {
    data: {
        id: string;
        meta: Meta;
        _links: Links;
    };
};

export interface GetConfigResponse<T> {
    data: GetConfigData<T>;
    _links: Record<string, Link>;
}

export interface GetConfigData<T> {
    id: string;
    name: string;
    createdAt: string; // ISO 8601 date-time
    updatedAt: string; // ISO 8601 date-time
    configType: EntityRef;
    configTypeId: string;
    data: T; // schema depends on configType
    tags: Record<string, string | boolean | null> | null;
    meta: {
        apiEnrollmentVersion?: string;
        apiVersion?: string;
        filterableFields?: string[];
        pagination?: {
            limit: number;
            offset: number;
            totalCount: number;
        };
    };
}

type Duration = string; // e.g., "5s", "1m"
type PortNumber = number; // 0–65535
type ProtocolName = "tcp" | "udp";
type Method = "GET" | "POST" | "PUT" | "PATCH";
type Precedence = "default" | "required" | "failed";

interface PortRange {
    low: PortNumber;
    high: PortNumber;
}

interface Action {
    trigger: "fail" | "pass" | "change";
    action: string; // matches pattern, e.g., "mark healthy", "send event"
    duration?: Duration;
    consecutiveEvents?: number;
}

type ActionList = Action[];

interface HttpCheck {
    interval: Duration;
    timeout: Duration;
    url: string;
    actions?: ActionList;
    method?: Method;
    body?: string;
    expectStatus?: number;
    expectInBody?: string;
}

type HttpCheckList = HttpCheck[];

interface PortCheck {
    interval: Duration;
    timeout: Duration;
    address: string;
    actions?: ActionList;
}

type PortCheckList = PortCheck[];

type InhabitedSet<T> = [T, ...T[]];

interface ProxyConfiguration {
    address: string; // host:port
    type: "http";
}

interface ListenOptions {
    bindUsingEdgeIdentity?: boolean;
    connectTimeout?: Duration;
    connectTimeoutSeconds?: number; // deprecated
    cost?: number;
    identity?: string;
    maxConnections?: number;
    precedence?: Precedence;
}

export interface HostV1ConfigData {
    address?: string;
    forwardAddress?: true;
    allowedAddresses?: InhabitedSet<string>;
    allowedSourceAddresses?: InhabitedSet<string>;
    port?: PortNumber;
    forwardPort?: true;
    allowedPortRanges?: InhabitedSet<PortRange>;
    protocol?: ProtocolName;
    forwardProtocol?: true;
    allowedProtocols?: InhabitedSet<ProtocolName>;
    httpChecks?: HttpCheckList;
    portChecks?: PortCheckList;
    listenOptions?: ListenOptions;
    proxy?: ProxyConfiguration;
}

export interface InterceptV1ConfigData {
  protocols: ("tcp" | "udp")[]; // required
  addresses: string[];          // required
  portRanges: {
    low: number;
    high: number;
  }[];                          // required
  sourceIp?: string;
  dialOptions?: {
    connectTimeoutSeconds?: number;
    identity?: string;
  };
}
