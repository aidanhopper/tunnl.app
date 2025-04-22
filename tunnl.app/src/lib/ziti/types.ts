export interface IdentityListResponse {
    data: IdentityResponse[];
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

interface Link {
    comment?: string;
    href: string;
    method?: string;
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
