import { Pool } from "pg";

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

        } catch {

        } finally {
            client.release();
        }
    }

    async getServiceBySlug() {
        const client = await this.pool.connect();
        try {

        } catch {

        } finally {
            client.release();
        }
    }
}

class Service {
    private id: string;
    private user_id: string;
    private created: Date;
    private slug: string;
    private name: string;
    private protocol: 'tcp/udp' | 'http';
    private enabled: boolean;

    constructor() {

    }
}

interface ServiceClientData {

}
