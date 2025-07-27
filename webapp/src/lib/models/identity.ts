import { deleteIdentityBySlug, insertIdentity, ISelectIdentitiesByUserIdResult, ISelectIdentityBySlugResult, selectIdentitiesByUserId, selectIdentityBySlug } from "@/db/types/identities.queries";
import { Pool } from "pg";
import * as zitiIdentities from '@/lib/ziti/identities';
import slugify from "../slugify";
import { GetIdentityResponse } from "../ziti/types";

export class IdentityManager {
    private userId: string;
    private pool: Pool;

    constructor({ pool, userId }: { pool: Pool, userId: string }) {
        this.userId = userId;
        this.pool = pool;
    }

    async getIdentityBySlug(slug: string) {
        const client = await this.pool.connect();
        try {
            const resultList = await selectIdentityBySlug.run(
                { slug: slug },
                client
            );
            const result = resultList[0] || null;
            if (result?.user_id !== this.userId) return null;
            return new Identity(resultList[0]);
        } finally {
            client.release();
        }
    }

    async getIdentities() {
        const client = await this.pool.connect();
        try {
            const resultList = await selectIdentitiesByUserId.run(
                { id: this.userId },
                client
            );
            return resultList.map(i => new Identity(i));
        } finally {
            client.release();
        }
    }

    async deleteIdentityBySlug(slug: string) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const resultList = await deleteIdentityBySlug.run({ slug: slug }, client);
            const result = resultList[0] || null;
            if (!result) throw new Error('Identity does not exist');
            if (result.user_id !== this.userId) throw new Error("Identity is not owned by user");
            await zitiIdentities.deleteIdentity(result.ziti_id);
            await client.query('COMMIT');
            return true;
        } catch (err) {
            console.error(err);
            await client.query('ROLLBACK');
            return false;
        } finally {
            client.release();
        }
    }

    async createIdentity(name: string) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const slug = slugify(name);
            const zitiResponse = await zitiIdentities.postIdentity({
                isAdmin: false,
                name: slug,
                type: 'Default',
                enrollment: { ott: true },
            });
            if (!zitiResponse) throw new Error("Post identity to ziti failed");
            const resultList = await insertIdentity.run({
                user_id: this.userId,
                name: name,
                slug: slug,
                ziti_id: zitiResponse.data.id
            }, client);
            if (resultList.length === 0) throw new Error('Something went wrong while inserting the identity');
            await client.query('COMMIT');
            return new Identity(resultList[0]);
        } catch (err) {
            console.error(err);
            await client.query('ROLLBACK');
            return null;
        }
        finally {
            client.release();
        }
    }
}

export class Identity {
    private id: string;
    private userId: string;
    private zitiId: string;
    private name: string;
    private slug: string;
    private created: Date;
    private isOnline: boolean;
    private lastSeen: Date | null;
    private zitiData: GetIdentityResponse | null = null;

    constructor(data: ISelectIdentitiesByUserIdResult | ISelectIdentityBySlugResult) {
        this.id = data.id;
        this.userId = data.user_id;
        this.zitiId = data.ziti_id;
        this.name = data.name;
        this.slug = data.slug;
        this.created = data.created;
        this.isOnline = data.is_online;
        this.lastSeen = data.last_seen;
    }

    private async getZitiData() {
        if (!this.zitiData)
            this.zitiData = await zitiIdentities.getIdentity(this.zitiId);
    }

    public async getRoleAttributes() {
        await this.getZitiData();
        return this.zitiData?.data.enrollment.ott;
    }

    public async getEnrollment() {
        await this.getZitiData();
        return this.zitiData?.data.enrollment;
    }

    getId() {
        return this.id;
    }

    getUserId() {
        return this.userId;
    }

    getZitiId() {
        return this.zitiId;
    }

    getName() {
        return this.name;
    }

    getSlug() {
        return this.slug;
    }

    getCreated() {
        return this.created;
    }

    getIsOnline() {
        return this.isOnline;
    }

    getLastSeen() {
        return this.lastSeen;
    }

    getClientData() {
        return {
            name: this.name,
            slug: this.slug,
            created: this.created,
            isOnline: this.isOnline,
            lastSeen: this.lastSeen
        } as IdentityClientData;
    }
}

export interface IdentityClientData {
    name: string;
    slug: string;
    created: Date;
    isOnline: boolean;
    lastSeen: Date | null;
}
