import { deleteServiceBySlug, insertService, ISelectServiceBySlugResult, ISelectServicesByUserIdResult, selectServiceBySlug, selectServicesByUserId } from "@/db/types/services.queries";
import { Pool } from "pg";
import slugify from "../slugify";
import { selectServiceDialsByServiceId } from "@/db/types/service_dials.queries";
import { TunnelBindingManager } from "./tunnel-binding";

export class ServiceManager {
    private userId: string;
    private pool: Pool;

    constructor({ pool, userId }: { pool: Pool, userId: string }) {
        this.userId = userId;
        this.pool = pool;
    }

    async getServices() {
        const client = await this.pool.connect();
        try {
            const resultList = await selectServicesByUserId.run(
                { id: this.userId },
                client
            );
            return resultList.map(e => new Service({ data: e, pool: this.pool }));
        } catch {
            return [];
        } finally {
            client.release();
        }
    }

    async getServiceBySlug(slug: string) {
        const client = await this.pool.connect();
        try {
            const resultList = await selectServiceBySlug.run(
                { slug: slug },
                client
            );
            const res = resultList[0] || null;
            if (!res || res.user_id !== this.userId)
                throw new Error('Service does not exist');
            return new Service({ data: res, pool: this.pool });
        } catch {
            return null;
        } finally {
            client.release();
        }
    }

    async createService({
        name,
        protocol
    }: {
        name: string,
        protocol: 'tcp/udp' | 'http';
    }) {
        const client = await this.pool.connect();
        try {
            const resultList = await insertService.run({
                name: name,
                slug: slugify(name),
                protocol: protocol,
                user_id: this.userId
            }, client);
            const res = resultList[0] || null;
            if (!res) throw new Error('Failed to insert service');
            return new Service({ data: res, pool: this.pool });
        } catch {
            return null;
        } finally {
            client.release();
        }
    }

    async deleteServiceBySlug(slug: string) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const resultList = await deleteServiceBySlug.run({
                slug: slug
            }, client);
            const res = resultList[0] || null;
            if (!res || res.user_id !== this.userId) throw new Error('Failed to delete service');
            await client.query('COMMIT');
            return true;
        } catch {
            await client.query('ROLLBACK');
            return false;
        } finally {
            client.release();
        }
    }
}

export class Service {
    private pool: Pool;
    private id: string;
    private userId: string;
    private created: Date;
    private slug: string;
    private name: string;
    private protocol: 'tcp/udp' | 'http';
    private enabled: boolean;
    private tunnelBindingManager: TunnelBindingManager;

    constructor({
        data,
        pool
    }: {
        data: ISelectServicesByUserIdResult | ISelectServiceBySlugResult,
        pool: Pool
    }) {
        this.id = data.id;
        this.userId = data.user_id;
        this.created = data.created;
        this.slug = data.slug;
        this.name = data.name;
        this.protocol = data.protocol as 'tcp/udp' | 'http';
        this.enabled = data.enabled;
        this.pool = pool;
        this.tunnelBindingManager = new TunnelBindingManager({ pool: pool, service: this })
    }

    getId() {
        return this.id;
    }

    getUserId() {
        return this.userId;
    }

    getCreated() {
        return this.created;
    }

    getSlug() {
        return this.slug;
    }

    getName() {
        return this.name;
    }

    getProtocol() {
        return this.protocol;
    }

    isEnabled() {
        return this.enabled;
    }

    getClientData() {
        return {
            created: this.created,
            slug: this.slug,
            name: this.name,
            protocol: this.protocol,
            enabled: this.enabled,
        } as ServiceClientData;
    }

    async getServiceDials() {
        const client = await this.pool.connect();
        try {
            const dials = await selectServiceDialsByServiceId.run(
                { service_id: this.id },
                client
            );
            return dials.map(e => {
                return {
                    dials: e.dials,
                    timestamp: e.timestamp
                } as ServiceDialData
            });
        } catch {
            return []
        } finally {
            client.release();
        }
    }

    getTunnelBindingManager() {
        return this.tunnelBindingManager;
    }
}

export interface ServiceClientData {
    created: Date;
    slug: string;
    name: string;
    protocol: 'tcp/udp' | 'http';
    enabled: boolean;
}

export interface ServiceDialData {
    dials: number,
    timestamp: Date
}
