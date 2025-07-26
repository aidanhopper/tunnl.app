import { IInsertShareLinkResult, insertShareLink } from "@/db/types/share_links.queries";
import { Pool } from "pg";
import slug from "../slug";

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

    async createShareLink({
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
            return new ShareLink(res[0]);
        } catch (err) {
            console.error(err);
            return null;
        } finally {
            client.release();
        }
    }
}

class ShareLink {
    private id: string;
    private expires: Date;
    private slug: string;
    private serviceId: string;
    private isOneTimeUse: boolean;

    constructor(data: IInsertShareLinkResult) {
        this.id = data.id;
        this.expires = data.expires;
        this.slug = data.slug;
        this.serviceId = data.service_id;
        this.isOneTimeUse = data.one_time_use;
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

    getServiceId() {
        return this.serviceId;
    }

    getIsOneTimeUse() {
        return this.isOneTimeUse;
    }

    getClientData() {
        return {
            expires: this.expires,
            slug: this.slug,
            isOneTimeUse: this.isOneTimeUse
        } as ShareLinkClientData; 
    }
}

export interface ShareLinkClientData {
    expires: Date;
    slug: string;
    isOneTimeUse: boolean;
}
