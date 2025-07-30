import { ISelectUserByEmailResult, selectUserByEmail } from "@/db/types/users.queries";
import { getServerSession } from "next-auth";
import { Pool } from "pg";
import { IdentityManager } from "./identity";
import { ServiceManager } from "./service";
import { ShareLinkConsumerManager } from "./share-link";
import { ShareAccessManager } from "./share";
import { ISelectUserByZitiIdentityIdResult } from "@/db/types/identities.queries";

export class UserManager {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async auth() {
        const session = await getServerSession();
        if (!session?.user?.email) return null;
        const email = session.user.email;
        const client = await this.pool.connect();
        try {
            const resultList = await selectUserByEmail.run({ email: email }, client);
            return new User({ data: resultList[0], pool: this.pool }) || null;
        } finally {
            client.release();
        }
    }
}

export class User {
    private id: string;
    private email: string;
    private roles: string[];
    private lastLogin: Date;
    private identityManager: IdentityManager;
    private serviceManager: ServiceManager;
    private shareLinkConsumerManager: ShareLinkConsumerManager;
    private ShareAccessManager: ShareAccessManager;

    constructor({
        data,
        pool
    }: {
        data: ISelectUserByEmailResult | ISelectUserByZitiIdentityIdResult,
        pool: Pool
    }) {
        this.id = data.id;
        this.email = data.email;
        this.roles = data.roles.split(" ");
        this.lastLogin = data.last_login;
        this.identityManager = new IdentityManager({ userId: this.id, pool: pool })
        this.serviceManager = new ServiceManager({ userId: this.id, pool: pool });
        this.shareLinkConsumerManager = new ShareLinkConsumerManager({ userId: this.id, pool: pool });
        this.ShareAccessManager = new ShareAccessManager({ userId: this.id, pool: pool });
    }

    getId() {
        return this.id;
    }

    getEmail() {
        return this.email;
    }

    getRoles() {
        return this.roles;
    }

    getLastLogin() {
        return this.lastLogin;
    }

    getIdentityManager() {
        return this.identityManager;
    }

    getServiceManager() {
        return this.serviceManager;
    }

    getShareLinkConsumerManager() {
        return this.shareLinkConsumerManager;
    }

    getShareAccessManager() {
        return this.ShareAccessManager;
    }

    isAdmin() {
        const emails = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '';
        return emails.split(',').find(e => e === this.getEmail()) !== undefined;
    }

    isApproved() {
        return this.roles.find(e => e === 'approved') !== undefined;
    }

    getClientData() {
        return {
            email: this.email,
            roles: this.roles,
            lastLogin: this.lastLogin
        } as UserClientData;
    }

}

export interface UserClientData {
    email: string;
    roles: string[];
    lastLogin: Date;
}
