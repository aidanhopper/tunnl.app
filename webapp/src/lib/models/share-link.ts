import { deleteShareLinkBySlug, deleteShareLinksByServiceId, IInsertShareLinkResult, insertShareLink, ISelectShareLinkBySlugResult, ISelectShareLinksByServiceIdResult, selectShareLinkBySlug, selectShareLinksByServiceId } from "@/db/types/share_links.queries";
import { Pool } from "pg";
import slug from "../slug";
import { ShareAccessManager } from "./share";
import { Service, ServiceClientData } from "./service";
import { selectServiceById } from "@/db/types/services.queries";

export const getShareLink = async ({
    slug,
    pool
}: {
    slug: string,
    pool: Pool
}) => {
    const client = await pool.connect();
    try {
        const res = await selectShareLinkBySlug.run({ slug }, client);
        if (res.length === 0) return null;
        return new ShareLink({ data: res[0], pool });
    } catch {
        return null;
    } finally {
        client.release();
    }
}

export class ShareLinkConsumerManager {
    private pool: Pool;
    private userId: string;
    private shareAccessManager: ShareAccessManager;

    constructor({
        pool,
        userId
    }: {
        pool: Pool,
        userId: string
    }) {
        this.pool = pool;
        this.userId = userId;
        this.shareAccessManager = new ShareAccessManager({ pool, userId });
    }

    async consume(slug: string) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const resultList = await deleteShareLinkBySlug.run({ slug: slug }, client);
            if (resultList.length === 0) throw new Error('Share link does not exist');
            const res = resultList[0];
            if (res.service_owner_user_id === this.userId)
                throw new Error('Cannot consume your own service share');
            this.shareAccessManager.createShare(res.service_id);
            await client.query('COMMIT');
        } catch {
            await client.query('ROLLBACK');
            return null;
        } finally {
            client.release();
        }
    }
}

export class ShareLinkProducerManager {
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

    async produce({
        expires,
        isOneTimeUse
    }: {
        expires: Date,
        isOneTimeUse: boolean
    }) {
        const client = await this.pool.connect();
        try {
            const res = await insertShareLink.run({
                service_id: this.serviceId,
                expires: expires,
                one_time_use: isOneTimeUse,
                slug: slug()
            }, client);
            if (!res[0]) throw new Error('Failed to insert share link');
            return new ShareLink({ data: res[0], pool: this.pool });
        } catch (err) {
            console.error(err);
            return null;
        } finally {
            client.release();
        }
    }

    async getShareLinks() {
        const client = await this.pool.connect();
        try {
            const resultList = await selectShareLinksByServiceId
                .run({ service_id: this.serviceId }, client);
            return resultList.map(e => new ShareLink({ data: e, pool: this.pool }));
        } catch {
            return [];
        }
        finally {
            client.release();
        }
    }

    async deleteShareLinks() {
        const client = await this.pool.connect();
        try {
            await deleteShareLinksByServiceId
                .run({ service_id: this.serviceId }, client);
            return true;
        } catch {
            return false;
        }
        finally {
            client.release();
        }
    }

    async deleteShareLinkBySlug(slug: string) {
        const client = await this.pool.connect();
        try {
            const res = await deleteShareLinkBySlug
                .run({ slug: slug }, client);
            return res.length !== 0;
        } catch {
            return false;
        }
        finally {
            client.release();
        }
    }
}

export class ShareLink {
    private pool: Pool;
    private id: string;
    private expires: Date;
    private slug: string;
    private serviceId: string;
    private isOneTimeUse: boolean;
    private producerEmail: string;
    private service: Service | null = null;

    constructor({
        pool,
        data
    }: {
        pool: Pool,
        data: IInsertShareLinkResult | ISelectShareLinkBySlugResult | ISelectShareLinksByServiceIdResult
    }) {
        this.id = data.id;
        this.expires = data.expires;
        this.slug = data.slug;
        this.serviceId = data.service_id;
        this.isOneTimeUse = data.one_time_use;
        this.producerEmail = data.producer_email;
        this.pool = pool;
    }

    async getService() {
        if (this.service) return this.service;
        const client = await this.pool.connect();
        try {
            const resultList = await selectServiceById.run({
                id: this.serviceId,
            }, client);
            if (resultList.length === 0)
                throw new Error('Service does not exist');
            const res = new Service({ data: resultList[0], pool: this.pool });
            this.service = res;
            return this.service;
        } catch {
            return null;
        } finally {
            client.release();
        }
    }

    getId() {
        return this.id;
    }

    getExpires() {
        return this.expires;
    }

    getSlug() {
        return this.slug;
    }

    getIsOneTimeUse() {
        return this.isOneTimeUse;
    }

    getProducerEmail() {
        return this.producerEmail;
    }

    async getClientData() {
        return {
            expires: this.expires,
            slug: this.slug,
            isOneTimeUse: this.isOneTimeUse,
            producerEmail: this.producerEmail,
            service: (await this.getService())?.getClientData()
        } as ShareLinkClientData;
    }
}

export interface ShareLinkClientData {
    expires: Date;
    slug: string;
    isOneTimeUse: boolean;
    producerEmail: string;
    service: ServiceClientData;
}
