import { Pool } from "pg";
import { ISelectZitiCircuitsByZitiServiceIdResult, selectZitiCircuitCreatedEventsByZitiServiceId, selectZitiCircuitsByZitiServiceId, selectZitiServiceDialsByZitiServiceId } from "@/db/types/events.queries";
import pool from "../db";

type Event<T> = {
    id: string;
    eventType: string;
    createdAt: Date;
    data: T;
}

type ZitiCircuitEvent = Event<{
    zitiServiceId: string,
    zitiIdentityId: string
}>

export class EventCruncher {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async getZitiServiceDialEvents({
        zitiServiceId,
        interval
    }: {
        zitiServiceId: string,
        interval: string
    }) {
        const client = await this.pool.connect();
        try {
            const res = await selectZitiServiceDialsByZitiServiceId
                .run({ ziti_service_id: zitiServiceId, interval }, client);
            console.log(res.map(e => e.data));
        } catch {
            return [];
        } finally {
            client.release();
        }
    }

    private parseZitiCircuitEvent(e: ISelectZitiCircuitsByZitiServiceIdResult): ZitiCircuitEvent {
        const parsedData = e.data as {
            tags: {
                serviceId: string,
                hostId: string,
                clientId: string
            }
        }

        return {
            id: e.id,
            eventType: e.event_type,
            createdAt: e.created_at,
            data: {
                zitiServiceId: parsedData.tags.serviceId,
                zitiIdentityId: parsedData.tags.clientId
            }
        }
    }

    async getZitiCircuitEvents({
        zitiServiceId,
        interval
    }: {
        zitiServiceId: string,
        interval: string
    }): Promise<ZitiCircuitEvent[]> {
        const client = await this.pool.connect();
        try {
            const res = await selectZitiCircuitsByZitiServiceId
                .run({ ziti_service_id: zitiServiceId, interval }, client);
            return res.map(this.parseZitiCircuitEvent);
        } catch {
            return [];
        } finally {
            client.release();
        }
    }

    async getZitiCircuitCreatedEvents({
        zitiServiceId,
        interval
    }: {
        zitiServiceId: string,
        interval: string
    }): Promise<ZitiCircuitEvent[]> {
        const client = await this.pool.connect();
        try {
            const res = await selectZitiCircuitCreatedEventsByZitiServiceId
                .run({ ziti_service_id: zitiServiceId, interval }, client);
            return res.map(this.parseZitiCircuitEvent);
        } catch {
            return [];
        } finally {
            client.release();
        }
    }
}

// Export a single instance
export const eventCruncher = new EventCruncher(pool);

export default eventCruncher;
