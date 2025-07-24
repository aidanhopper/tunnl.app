import { ISelectTunnelBindingsByServiceIdResult, selectTunnelBindingsByServiceId } from "@/db/types/tunnel_bindings.queries";
import { Pool } from "pg";
import { GetConfigData, HostV1ConfigData, InterceptV1ConfigData, Service, ServicePolicyDetail } from "../ziti/types";
import { getConfig } from "../ziti/configs";
import { getService } from "../ziti/services";
import { getPolicy } from "../ziti/policies";

// Port config discriminated union
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

// Tunnel Host Form
export interface TunnelBindingHost {
    protocol: 'tcp' | 'udp' | 'tcp/udp';
    address: string;
    zitiIdentityId: string;
    portConfig: PortConfig;
}

// Tunnel Intercept Form
export interface TunnelBindingIntercept {
    address: string;
    portConfig: PortConfig;
}

export class TunnelBindingManager {
    private pool: Pool;
    private serviceId: string;

    constructor({
        pool,
        serviceId
    }: {
        pool: Pool,
        serviceId: string
    }) {
        this.pool = pool;
        this.serviceId = serviceId;
    }

    async getTunnelBindings() {
        const client = await this.pool.connect();
        try {
            const resultList = await selectTunnelBindingsByServiceId.run(
                { service_id: this.serviceId },
                client
            );
            return resultList.map(e => new TunnelBinding(e));
        } catch {
            return [];
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

    }
}

class TunnelBinding {
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
    private zitiService: Service | null = null;

    constructor(data: ISelectTunnelBindingsByServiceIdResult) {
        this.id = data.id;
        this.serviceId = data.service_id;
        this.zitiHostId = data.ziti_host_id;
        this.zitiInterceptId = data.ziti_intercept_id;
        this.zitiDialId = data.ziti_dial_id;
        this.zitiBindId = data.ziti_bind_id;
        this.zitiServiceId = data.ziti_service_id;
        this.entryPoint = data.entry_point;
        this.slug = data.slug;
        this.created = data.created;
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
        return this.zitiIntercept?.data.addresses
    }

    getId() {
        return this.id;
    }

    getServiceId() {
        return this.serviceId;
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

    getClientData() {
        return {
            entryPoint: this.entryPoint,
            slug: this.slug,
            created: this.created,
        } as TunnelBindingClientData
    }
}

export interface TunnelBindingClientData {
    entryPoint: boolean;
    slug: string;
    created: Date;
}

