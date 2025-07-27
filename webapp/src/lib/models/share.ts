import { deleteShareBySlug, deleteSharesByServiceIdButNotOwner, IInsertShareResult, insertShare, ISelectSharesByUserIdResult, selectSharesByServiceId, selectSharesByUserId } from "@/db/types/shares.queries";
import { Pool } from "pg";
import { Service, ServiceClientData } from "./service";
import { selectServiceById } from "@/db/types/services.queries";
import slugify from "../slugify";

export class ShareAccessManager {
    private userId: string;
    private pool: Pool;

    constructor({
        userId,
        pool
    }: {
        userId: string,
        pool: Pool
    }) {
        this.userId = userId;
        this.pool = pool;
    }

    async createShare(serviceId: string) {
        const client = await this.pool.connect();
        try {
            const res = await insertShare.run({
                service_id: serviceId,
                user_id: this.userId,
                slug: slugify('Share')
            }, client)
            if (res.length === 0) throw new Error('Could not insert share');
            return new Share({ data: res[0], pool: this.pool });
        } catch {
            return null;
        } finally {
            client.release();
        }
    }

    async getShares() {
        const client = await this.pool.connect();
        try {
            const res = await selectSharesByUserId
                .run({ user_id: this.userId }, client);
            return new ShareList(...res.map(e => new Share({
                data: e,
                pool: this.pool
            })));
        } catch {
            return new ShareList(...[]);
        } finally {
            client.release();
        }
    }

    async deleteShareBySlug(slug: string) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const res = await deleteShareBySlug
                .run({ slug }, client)
            if (res.length === 0 || res[0].user_id !== this.userId)
                throw new Error('Could not delete share');
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

export class ShareGrantManager {
    private serviceId: string;
    private ownerUserId: string;
    private pool: Pool;

    constructor({
        serviceId,
        ownerUserId,
        pool
    }: {
        serviceId: string,
        ownerUserId: string,
        pool: Pool
    }) {
        this.serviceId = serviceId;
        this.ownerUserId = ownerUserId;
        this.pool = pool;
    }

    async getShares() {
        const client = await this.pool.connect();
        try {
            const res = await selectSharesByServiceId
                .run({ service_id: this.serviceId }, client);
            return new ShareList(...res.map(e => new Share({
                data: e,
                pool: this.pool
            })));
        } catch {
            return new ShareList(...[]);
        } finally {
            client.release();
        }
    }

    async deleteShares() {
        const client = await this.pool.connect();
        try {
            await deleteSharesByServiceIdButNotOwner.run({
                service_id: this.serviceId,
                owner_user_id: this.ownerUserId
            }, client);
            return true;
        } catch {
            return false;
        } finally {
            client.release();
        }
    }

    async deleteShareBySlug(slug: string) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const res = await deleteShareBySlug
                .run({ slug }, client)
            if (res.length === 0 || res[0].service_id !== this.serviceId)
                throw new Error('Could not delete share');
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

class ShareList extends Array<Share> {
    constructor(...items: Share[]) {
        super(...items);
        Object.setPrototypeOf(this, ShareList.prototype);
    }

    async owned() {
        return await Promise.all(this.filter(async e => {
            const service = await e.getService();
            if (!service) return false;
            return service.getUserId() === e.getUserId();
        }))
    }

    async unowned() {
        return await Promise.all(this.filter(async e => {
            const service = await e.getService();
            if (!service) return false;
            return service.getUserId() !== e.getUserId();
        }))
    }
}

class Share {
    private pool: Pool;
    private id: string;
    private userId: string;
    private serviceId: string;
    private slug: string;
    private granteeEmail: string;
    private granterEmail: string;
    private service: Service | null = null;

    constructor({
        data,
        pool
    }: {
        data: IInsertShareResult | ISelectSharesByUserIdResult,
        pool: Pool
    }) {
        this.id = data.id;
        this.userId = data.user_id;
        this.serviceId = data.service_id;
        this.userId = data.user_id;
        this.slug = data.slug;
        this.granteeEmail = data.grantee_email;
        this.granterEmail = data.granter_email;
        this.pool = pool;
    }

    async getService() {
        if (this.service) return this.service;
        const client = await this.pool.connect();
        try {
            const resultList = await selectServiceById.run({ id: this.serviceId }, client);
            if (resultList.length === 0) throw new Error('Service does not exist');
            this.service = new Service({ data: resultList[0], pool: this.pool });
            return this.service
        } catch {
            return null;
        } finally {
            client.release();
        }
    }

    getGranteeEmail() {
        return this.granteeEmail;
    }

    getGranterEmail() {
        return this.granterEmail;
    }

    getId() {
        return this.id;
    }

    getUserId() {
        return this.userId;
    }

    getServiceId() {
        return this.serviceId;
    }

    async getClientData() {
        const service = await this.getService();
        if (!service) return null;
        return {
            service: await service.getClientData(),
            granteeEmail: this.granteeEmail,
            granterEmail: this.granterEmail,
            slug: this.slug
        } as ShareClientData;
    }
}


export interface ShareClientData {
    service: ServiceClientData,
    slug: string,
    granteeEmail: string,
    granterEmail: string,
}
