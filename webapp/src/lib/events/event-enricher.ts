import { Pool } from "pg";
import { Event, ZitiCircuitEvent } from "./types";
import { selectUserByZitiIdentityId } from "@/db/types/identities.queries";
import { User, UserClientData } from "../models/user";

type EnrichedEvent<Event, Enriched> = {
    event: Event,
    enrichedData: Enriched
}

export type EnrichedZitiCircuitEvent = EnrichedEvent<ZitiCircuitEvent, {
    user: UserClientData | null
}>

export class EventEnricher {
    private pool: Pool;
    private cache: Map<string, any>;

    constructor(pool: Pool) {
        this.pool = pool;
        this.cache = new Map<string, any>();
    }

    async enrichZitiCircuitEvent(e: ZitiCircuitEvent): Promise<EnrichedZitiCircuitEvent | null> {
        if (this.cache.has(e.data.zitiIdentityId)) {
            const cachedData = this.cache.get(e.data.zitiIdentityId) as UserClientData | null;
            if (!cachedData) {
                return {
                    event: e,
                    enrichedData: {
                        user: null
                    }
                };
            }

            return {
                event: e,
                enrichedData: {
                    user: cachedData
                }
            };
        }

        const client = await this.pool.connect();
        try {
            const identityResultList = await selectUserByZitiIdentityId
                .run({ ziti_identity_id: e.data.zitiIdentityId }, client);
            if (identityResultList.length === 0) throw new Error('Identity does not exist');

            const user = new User({
                pool: this.pool,
                data: identityResultList[0]
            });

            this.cache.set(e.data.zitiIdentityId, user.getClientData());

            return {
                event: e,
                enrichedData: {
                    user: user.getClientData()
                }
            };
        } catch {
            this.cache.set(e.data.zitiIdentityId, null);
            return null;
        } finally {
            client.release();
        }
    }
}
