import { deleteTunnelBindingBySlug, insertTunnelBinding, ISelectTunnelBindingsByServiceIdResult, selectTunnelBindingBySlug, selectTunnelBindingsByServiceId } from "@/db/types/tunnel_bindings.queries";
import { Pool } from "pg";
import { GetConfigData, HostV1ConfigData, InterceptV1ConfigData, GetServiceData, ServicePolicyDetail } from "../ziti/types";
import { deleteConfig, getConfig, getConfigIds, patchConfig, postConfig } from "../ziti/configs";
import { deleteService, getService, postService } from "../ziti/services";
import { deletePolicy, getPolicy, patchPolicy, postPolicy } from "../ziti/policies";
import { Service } from './service';
import slugify from "../slugify";
import { selectIdentityBySlug } from "@/db/types/identities.queries";
import { Identity, IdentityClientData } from "./identity";

interface PortConfigForwardFalse {
    forwardPorts: false;
    port: string;
}

interface PortConfigForwardTrue {
    forwardPorts: true;
    portRange: {
        low: number,
        high: number
    }[];
}

type PortConfig = PortConfigForwardFalse | PortConfigForwardTrue;

export interface TunnelBindingHost {
    protocol: 'tcp' | 'udp' | 'tcp/udp';
    address: string;
    zitiIdentityId: string;
    portConfig: PortConfig;
}

export interface TunnelBindingIntercept {
    address: string;
    portConfig: PortConfig;
}

export class TunnelBindingManager {
    private pool: Pool;
    private service: Service;
    private zitiInterceptV1Id: string | null = null;
    private zitiHostV1Id: string | null = null;
    private count: number | null = null;

    constructor({
        pool,
        service
    }: {
        pool: Pool,
        service: Service
    }) {
        this.pool = pool;
        this.service = service;
    }

    private async getZitiConfigIds() {
        if (this.zitiHostV1Id && this.zitiInterceptV1Id)
            return {
                interceptV1Id: this.zitiInterceptV1Id,
                hostV1Id: this.zitiHostV1Id
            };
        const { hostV1Id, interceptV1Id } = await getConfigIds();
        this.zitiHostV1Id = hostV1Id;
        this.zitiInterceptV1Id = interceptV1Id;
        return {
            interceptV1Id: this.zitiInterceptV1Id,
            hostV1Id: this.zitiHostV1Id
        };
    }

    async getCount() {
        if (this.count !== null) return this.count;
        const client = await this.pool.connect();
        try {
            const resultList = await selectTunnelBindingsByServiceId.run(
                { service_id: this.service.getId() },
                client
            );
            this.count = resultList.length;
            return this.count;
        } catch {
            this.count = 0;
            return this.count;
        } finally {
            client.release();
        }
    }

    async getTunnelBindings() {
        const client = await this.pool.connect();
        try {
            const resultList = await selectTunnelBindingsByServiceId.run(
                { service_id: this.service.getId() },
                client
            );
            return resultList.map(e => new TunnelBinding({ data: e, pool: this.pool }));
        } catch {
            return [];
        } finally {
            client.release();
        }
    }

    async getTunnelBindingBySlug(slug: string) {
        const client = await this.pool.connect();
        try {
            const resultList = await selectTunnelBindingBySlug
                .run({ slug }, client);
            if (resultList.length === 0
                || resultList[0].service_id !== this.service.getId())
                throw new Error('Tunnel binding not found');
            return new TunnelBinding({ data: resultList[0], pool: this.pool });
        } catch {
            return null;
        } finally {
            client.release();
        }
    }

    async createTunnelBinding({
        host,
        intercept
    }: {
        host: TunnelBindingHost,
        intercept: TunnelBindingIntercept
    }) {
        // dont let users create more than one tunnel binding for now
        const count = await this.getCount();
        if (count !== 0) return false;

        const client = await this.pool.connect();
        try {
            const { hostV1Id, interceptV1Id } = await this.getZitiConfigIds();

            const zitiServiceName = slugify(this.service.getSlug());

            const hostRes = await postConfig({
                configTypeId: hostV1Id,
                name: `${zitiServiceName}-host-config`,
                data: {
                    ...(host.protocol === 'tcp/udp' ? {
                        forwardProtocol: true,
                        allowedProtocols: [
                            'tcp',
                            'udp'
                        ]
                    } : {
                        protocol: host.protocol,
                    }),
                    address: host.address,
                    ...(host.portConfig.forwardPorts ? {
                        forwardPort: true,
                        allowedPortRanges: host.portConfig.portRange,
                    } : {
                        port: Number(host.portConfig.port)
                    }),
                    portChecks: [],
                    httpChecks: []
                }
            });

            if (!hostRes) throw new Error('Error posting host host config');

            const interceptRes = await postConfig({
                name: `${zitiServiceName}-intercept-config`,
                configTypeId: interceptV1Id,
                data: {
                    portRanges: intercept.portConfig.forwardPorts ?
                        intercept.portConfig.portRange : [{
                            high: Number(intercept.portConfig.port),
                            low: Number(intercept.portConfig.port)
                        }],
                    addresses: [
                        intercept.address
                    ],
                    protocols: host.protocol === 'tcp' ? [
                        'tcp'
                    ] : host.protocol === 'udp' ? [
                        'udp'
                    ] : [
                        'tcp',
                        'udp'
                    ]
                },
            });

            if (!interceptRes) throw new Error('Error posting intercept config');

            const serviceRes = await postService({
                name: zitiServiceName,
                configs: [interceptRes.data.id, hostRes.data.id],
                encryptionRequired: true
            });

            if (!serviceRes) throw new Error('Error posting service');

            const dialRes = await postPolicy({
                type: 'Dial',
                name: `${zitiServiceName}-dial`,
                semantic: 'AnyOf',
                serviceRoles: [`@${serviceRes.data.id}`],
                identityRoles: [`#${zitiServiceName}-dial`],
                postureCheckRoles: []
            });

            if (!dialRes) throw new Error('Error posting dial policy');

            const bindRes = await postPolicy({
                type: 'Bind',
                name: `${zitiServiceName}-bind`,
                semantic: 'AnyOf',
                serviceRoles: [`@${serviceRes.data.id}`],
                identityRoles: [`@${host.zitiIdentityId}`],
                postureCheckRoles: []
            });

            if (!bindRes) throw new Error('Error posting bind policy');

            await insertTunnelBinding.run({
                service_id: this.service.getId(),
                ziti_host_id: hostRes.data.id,
                ziti_intercept_id: interceptRes.data.id,
                ziti_dial_id: dialRes.data.id,
                ziti_bind_id: bindRes.data.id,
                ziti_service_id: serviceRes.data.id,
                entry_point: true,
                slug: slugify('Tunnel Binding')
            }, client);

            this.count = count + 1;
            return true;
        } catch (err) {
            console.error(err);
            return false;
        } finally {
            client.release();
        }
    }

    async updateTunnelBinding({
        slug,
        host,
        intercept
    }: {
        slug: string
        host: TunnelBindingHost,
        intercept: TunnelBindingIntercept
    }) {
        const tunnelBinding = await this.getTunnelBindingBySlug(slug);
        if (!tunnelBinding) return false;

        await patchConfig({
            ziti_id: tunnelBinding.getZitiHostId(),
            data: {
                data: {
                    ...(host.protocol === 'tcp/udp' ? {
                        forwardProtocol: true,
                        allowedProtocols: [
                            'tcp',
                            'udp'
                        ]
                    } : {
                        protocol: host.protocol,
                    }),
                    address: host.address,
                    ...(host.portConfig.forwardPorts ? {
                        forwardPort: true,
                        allowedPortRanges: host.portConfig.portRange,
                    } : {
                        port: Number(host.portConfig.port)
                    }),
                }
            }
        });

        await patchConfig({
            ziti_id: tunnelBinding.getZitiInterceptId(),
            data: {
                data: {
                    portRanges: intercept.portConfig.forwardPorts ?
                        intercept.portConfig.portRange : [{
                            high: Number(intercept.portConfig.port),
                            low: Number(intercept.portConfig.port)
                        }],
                    addresses: [
                        intercept.address
                    ],
                    protocols: host.protocol === 'tcp' ? [
                        'tcp'
                    ] : host.protocol === 'udp' ? [
                        'udp'
                    ] : [
                        'tcp',
                        'udp'
                    ]
                }
            }
        });

        await patchPolicy({
            ziti_id: tunnelBinding.getZitiBindId(),
            data: { identityRoles: [`@${host.zitiIdentityId}`] }
        });
    }

    async deleteTunnelBindings() {
        const tunnelBindings = await this.getTunnelBindings();
        Promise.all(tunnelBindings.map(async e => {
            await this.deleteTunnelBindingBySlug(e.getSlug());
        }));
    }

    async deleteTunnelBindingBySlug(slug: string) {
        const client = await this.pool.connect();
        try {
            client.query('BEGIN');

            const resultList = await deleteTunnelBindingBySlug
                .run({ slug: slug }, client);
            if (resultList.length === 0 || resultList[0].service_id !== this.service.getId())
                throw new Error('Failed to delete tunnel binding');

            const tunnelBinding = new TunnelBinding({
                pool: this.pool,
                data: resultList[0]
            });

            await deleteService(tunnelBinding.getZitiServiceId());
            await deleteConfig(tunnelBinding.getZitiInterceptId());
            await deleteConfig(tunnelBinding.getZitiHostId());
            await deletePolicy(tunnelBinding.getZitiDialId());
            await deletePolicy(tunnelBinding.getZitiBindId());

            client.query('COMMIT');
            return true;
        } catch (err) {
            console.error(err);
            client.query('ROLLBACK');
            return false;
        } finally {
            client.release();
        }
    }
}

export class TunnelBinding {
    private pool: Pool;
    private id: string;
    private serviceId: string;
    private zitiHostId: string;
    private zitiInterceptId: string;
    private zitiDialId: string;
    private zitiBindId: string;
    private zitiServiceId: string;
    private entryPoint: boolean;
    private slug: string;
    private created: Date;
    private zitiHost: GetConfigData<HostV1ConfigData> | null = null;
    private zitiIntercept: GetConfigData<InterceptV1ConfigData> | null = null;
    private zitiBind: ServicePolicyDetail | null = null;
    private zitiDial: ServicePolicyDetail | null = null;
    private zitiService: GetServiceData | null = null;

    constructor({
        pool,
        data
    }: {
        pool: Pool,
        data: ISelectTunnelBindingsByServiceIdResult
    }) {
        this.serviceId = data.service_id;
        this.id = data.id;
        this.zitiHostId = data.ziti_host_id;
        this.zitiInterceptId = data.ziti_intercept_id;
        this.zitiDialId = data.ziti_dial_id;
        this.zitiBindId = data.ziti_bind_id;
        this.zitiServiceId = data.ziti_service_id;
        this.entryPoint = data.entry_point;
        this.slug = data.slug;
        this.created = data.created;
        this.pool = pool;
    }

    private async getZitiConfig<T>(id: string) {
        const res = await getConfig<T>(id);
        return res?.data ?? null;
    }

    private async getZitiPolicy(id: string) {
        const res = await getPolicy(id);
        return res?.data ?? null;
    }

    private async getZitiIntercept() {
        if (this.zitiIntercept) return;
        this.zitiIntercept = await this.getZitiConfig<InterceptV1ConfigData>(this.zitiInterceptId);
    }

    private async getZitiHost() {
        if (this.zitiHost) return;
        this.zitiHost = await this.getZitiConfig<HostV1ConfigData>(this.zitiHostId);
    }

    private async getZitiDial() {
        if (this.zitiDial) return;
        this.zitiDial = await this.getZitiPolicy(this.zitiDialId);
    }

    private async getZitiBind() {
        if (this.zitiBind) return;
        this.zitiBind = await this.getZitiPolicy(this.zitiBindId);
    }

    private async getZitiService() {
        if (this.zitiService) return;
        const res = await getService(this.zitiServiceId);
        this.zitiService = res?.data ?? null;
    }

    async getAddresses() {
        await this.getZitiIntercept();
        if (!this.zitiIntercept) return null;
        return this.zitiIntercept?.data.addresses
    }

    async getProtocol() {
        await this.getZitiIntercept();
        const protocol = this.zitiIntercept?.data.protocols;
        if (!protocol) return null;
        return protocol?.join(' / ').toUpperCase();
    }

    async getHostingIdentity() {
        await this.getZitiBind();
        const slug = this.zitiBind?.identityRolesDisplay[0].name.substring(1) ?? null;
        if (!slug) return null;
        const client = await this.pool.connect();
        try {
            const ret = await selectIdentityBySlug.run({ slug }, client);
            return new Identity(ret[0]) ?? null;
        } catch {
            return null;
        } finally {
            client.release();
        }
    }

    private portRangeToString(portRange: { high: number, low: number }[]) {
        return portRange.map(e => {
            if (e.high === e.low)
                return e.high.toString();
            return `${e.low}-${e.high}`;
        }).join(' ');
    }

    async getInterceptPortRange() {
        await this.getZitiIntercept();
        const portRange = this.zitiIntercept?.data.portRanges;
        if (!portRange) return null;
        return this.portRangeToString(portRange);
    }

    async getDialRole() {
        await this.getZitiDial();
        return this.zitiDial
            ?.identityRolesDisplay[0]
            .role
            .substring(1) ?? null
    }

    getId() {
        return this.id;
    }

    getZitiHostId() {
        return this.zitiHostId;
    }

    getZitiInterceptId() {
        return this.zitiInterceptId;
    }

    getZitiDialId() {
        return this.zitiDialId;
    }

    getZitiBindId() {
        return this.zitiBindId;
    }

    getZitiServiceId() {
        return this.zitiServiceId;
    }

    isEntryPoint() {
        return this.entryPoint;
    }

    getSlug() {
        return this.slug;
    }

    getCreated() {
        return this.created;
    }

    getServiceId() {
        return this.serviceId;
    }

    async getZitiData(): Promise<ZitiData> {
        await this.getZitiHost();
        await this.getZitiIntercept();

        const hostProtocol = this.zitiHost?.data.protocol ?? null;
        const hostAddress = this.zitiHost?.data.address ?? null;
        const hostForwardPorts = this.zitiHost?.data.forwardPort ?? false;
        const hostAllowedPortRanges = this.zitiHost?.data.allowedPortRanges ?
            this.portRangeToString(this.zitiHost?.data.allowedPortRanges) : null;
        const hostPort = this.zitiHost?.data.port ?? null;

        const interceptAddress = this.zitiIntercept?.data.addresses[0] ?? null;
        const interceptPortRange = await this.getInterceptPortRange() ?? null;

        return {
            host: {
                protocol: hostProtocol as string,
                address: hostAddress,
                portConfig: hostForwardPorts === true ? {
                    forwardPorts: true,
                    allowedPortRanges: hostAllowedPortRanges
                } : {
                    forwardPorts: false,
                    port: hostPort?.toString() ?? null
                },
            },
            intercept: {
                address: interceptAddress,
                portConfig: hostForwardPorts === true ? {
                    forwardPorts: true
                } : {
                    forwardPorts: false,
                    portRange: interceptPortRange
                },
            }
        } as ZitiData;
    }

    async getClientData(): Promise<TunnelBindingClientData> {
        return {
            entryPoint: this.entryPoint,
            slug: this.slug,
            created: this.created,
            protocol: await this.getProtocol(),
            hostingIdentity: (await this.getHostingIdentity())?.getClientData() ?? null,
            zitiData: await this.getZitiData()
        } as TunnelBindingClientData
    }
}

interface ZitiData {
    host: {
        protocol: string,
        address: string,
        portConfig: {
            forwardPorts: true,
            allowedPortRanges: string
        } | {
            forwardPorts: false,
            port: string
        } | null,
    },
    intercept: {
        address: string,
        portConfig: {
            forwardPorts: true,
        } | {
            forwardPorts: false,
            portRange: string
        } | null,
    }
}

export interface TunnelBindingClientData {
    entryPoint: boolean;
    slug: string;
    created: Date;
    protocol: 'TCP' | 'UDP' | 'TCP / UDP';
    hostingIdentity: IdentityClientData | null;
    zitiData: ZitiData;
}

