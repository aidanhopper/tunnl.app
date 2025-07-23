import { ISelectUserByEmailResult, selectUserByEmail } from "@/db/types/users.queries";
import { getServerSession } from "next-auth";
import { Pool } from "pg";
import { IdentityManager } from "./identity";

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

class User {
    private id: string;
    private email: string;
    private roles: string[];
    private lastLogin: Date;
    private identityManager: IdentityManager;

    constructor({ data, pool }: { data: ISelectUserByEmailResult, pool: Pool }) {
        this.id = data.id;
        this.email = data.email;
        this.roles = data.roles.split(" ");
        this.lastLogin = data.last_login;
        this.identityManager = new IdentityManager({ userId: this.id, pool: pool })
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
