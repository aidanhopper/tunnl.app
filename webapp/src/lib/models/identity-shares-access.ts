import { Pool } from "pg";

// on the identity side need to be able to add and remove
// identities from shares as well as update the roles when they've been added
export class IdentitySharesAccessManager {
    private pool: Pool;
    private identityId: string;
    private userId: string;

    constructor({
        pool,
        identityId,
        userId
    }: {
        pool: Pool,
        identityId: string,
        userId: string
    }) {
        this.pool = pool;
        this.identityId = identityId;
        this.userId = userId;
    }

    private async getRole(shareSlug: string) {

    }

    async addIdentityToShare(shareSlug: string) {

    } 

    async removeIdentityFromShare(shareSlug: string) {

    }

    // go thorugh all identities shares and update their roles
    async updateZitiDialRoles() {

    }
}

// only need to be able to update dial roles on the service side
// when deleting someone from the service update their dial roles
// thats it
export class IdentitySharesGrantManager {
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

    private async getRole() {

    }

    async updateZitiDialRoles() {

    }
}
