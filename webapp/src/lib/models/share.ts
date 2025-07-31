import { deleteShareBySlug, deleteSharesByServiceIdButNotOwner, IInsertShareResult, insertShare, ISelectShareBySlugResult, ISelectSharesByUserIdResult, selectShareBySlug, selectSharesByServiceId, selectSharesByUserId } from "@/db/types/shares.queries";
import { Pool } from "pg";
import { Service, ServiceClientData } from "./service";
import { selectServiceById } from "@/db/types/services.queries";
import slugify from "../slugify";
import { deleteIdentitySharesAccessBySlugs, insertIdentitySharesAccessBySlugs, selectIdentitySharesAccessByServiceId, selectIdentitySharesAccessByUserId } from "@/db/types/identity_shares_access.queries";
import { patchIdentity } from "../ziti/identities";
import { isApproved, UserManager } from "./user";

export class ShareAccessManager {
    private userId: string;
    private pool: Pool;
    private roleCache: Map<string, string> = new Map<string, string>();

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

    private async getUser() {
        return await new UserManager(this.pool).getUserById(this.userId);
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

    private async getRole(shareSlug: string): Promise<string | null> {
        if (this.roleCache.has(shareSlug)) return this.roleCache.get(shareSlug) ?? null;
        const client = await this.pool.connect();
        try {
            const resultList = await selectShareBySlug
                .run({ slug: shareSlug }, client);
            if (resultList.length === 0 || resultList[0].user_id !== this.userId)
                return null;
            const share = new Share({ data: resultList[0], pool: this.pool });
            const role = await share.getRole();
            if (!role) return null;
            this.roleCache.set(shareSlug, role);
            return role;
        } catch {
            return null;
        } finally {
            client.release();
        }
    }

    async addIdentityToShare({
        shareSlug,
        identitySlug
    }: {
        shareSlug: string,
        identitySlug: string
    }) {
        const client = await this.pool.connect();
        try {
            const res = await insertIdentitySharesAccessBySlugs.run({
                share_slug: shareSlug,
                identity_slug: identitySlug
            }, client);
            if (res.length === 0) throw new Error('Failed to insert share access');
            return true;
        } catch {
            return false;
        } finally {
            client.release();
        }
    }

    async removeIdentityFromShare({
        shareSlug,
        identitySlug
    }: {
        shareSlug: string,
        identitySlug: string
    }) {
        const client = await this.pool.connect();
        try {
            const res = await deleteIdentitySharesAccessBySlugs.run({
                share_slug: shareSlug,
                identity_slug: identitySlug
            }, client);
            if (res.length === 0) throw new Error('Failed to delete share access');
            return true;
        } catch {
            return false;
        } finally {
            client.release();
        }
    }

    // get all users identities that have 
    async updateZitiDialRoles() {
        const client = await this.pool.connect();
        try {
            const res = await selectIdentitySharesAccessByUserId
                .run({ user_id: this.userId }, client);

            const identityMap = new Map<string, string[]>();

            await Promise.all(res.map(async e => {
                if (!e.enabled || !isApproved(e.grantee_roles.split(' '))
                    || !isApproved(e.granter_roles.split(' '))) {
                    if (!identityMap.has(e.identity_ziti_id))
                        identityMap.set(e.identity_ziti_id, []);
                    return;
                }
                if (!identityMap.has(e.identity_ziti_id))
                    identityMap.set(e.identity_ziti_id, []);
                const role = await this.getRole(e.share_slug);
                if (role) {
                    const roles = [...identityMap.get(e.identity_ziti_id) ?? [], role]
                    identityMap.set(e.identity_ziti_id, roles);
                }
            }));

            await Promise.all(
                Array.from(identityMap.entries()).map(async ([zitiIdentityId, roles]) => {
                    await patchIdentity({
                        ziti_id: zitiIdentityId,
                        data: { roleAttributes: roles }
                    })
                })
            );

            return true;
        } catch {
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
    private service: Service | null = null;
    private roleCache: Map<string, string> = new Map<string, string>();

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

    private async getService() {
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

    private async getRole(shareSlug: string): Promise<string | null> {
        if (this.roleCache.has(shareSlug)) return this.roleCache.get(shareSlug) ?? null;
        const client = await this.pool.connect();
        try {
            const resultList = await selectShareBySlug
                .run({ slug: shareSlug }, client);
            if (resultList.length === 0 || resultList[0].service_id !== this.serviceId)
                return null;
            const share = new Share({ data: resultList[0], pool: this.pool });
            const role = await share.getRole();
            if (!role) return null;
            this.roleCache.set(shareSlug, role);
            return role;
        } catch {
            return null;
        } finally {
            client.release();
        }
    }

    async updateZitiDialRoles() {
        const client = await this.pool.connect();
        try {
            const res = await selectIdentitySharesAccessByServiceId
                .run({ service_id: this.serviceId }, client);

            const userManager = new UserManager(this.pool);

            const userIdSet = new Set<string>();
            res.forEach(e => userIdSet.add(e.grantee_id));
            const userIds = [...userIdSet];

            await Promise.all(userIds.map(async id => {
                const user = await userManager.getUserById(id);
                if (!user) return;
                await user.getShareAccessManager().updateZitiDialRoles();
            }));

            return true;
        } catch {
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
        const results = await Promise.all(this.map(async e => {
            const service = await e.getService();
            if (!service) return null;
            return service.getUserId() === e.getUserId() ? e : null;
        }));

        return results.filter(e => e !== null);
    }

    async unowned() {
        const results = await Promise.all(this.map(async e => {
            const service = await e.getService();
            if (!service) return null;
            return service.getUserId() !== e.getUserId() ? e : null;
        }));

        return results.filter(e => e !== null);
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
    private role: string | null = null;

    constructor({
        data,
        pool
    }: {
        data: IInsertShareResult | ISelectSharesByUserIdResult | ISelectShareBySlugResult,
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

    async getRole(): Promise<string | null> {
        if (this.role) return this.role;
        const service = await this.getService();
        if (!service) return null;
        const role = await (await service.getEntryPoint())?.getDialRole() ?? null;
        this.role = role;
        return this.role;
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

    getSlug() {
        return this.slug;
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
